import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaClient, Department } from '@prisma/client'
import { CreateDepartmentDto } from './dto/create-department.dto'
import { UpdateDepartmentDto } from './dto/update-department.dto'
import { createUniqueId } from '@/utils/unique-id'
import { listToTree } from '@/utils/list-to-tree'
import { omit } from '@/utils/object'

@Injectable()
export class DepartmentService extends PrismaClient {
  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const { name, parentId } = createDepartmentDto

    await this._validateNameRepeat(name, parentId)

    const id = createUniqueId()
    let fullPath = id

    if (parentId !== '-1') {
      fullPath = await this._generateFullPath(parentId, id)
    }

    return this.department.create({
      data: {
        ...createDepartmentDto,
        id,
        fullPath
      }
    })
  }

  async findAll(keyword: string): Promise<Department[]> {
    const departments = await this.department.findMany({ where: { name: { contains: keyword } } })

    return listToTree(departments)
  }

  async findOne(id: string): Promise<Department | null> {
    return this.department.findUnique({ where: { id } })
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    const cloneUpdateDepartmentDto = omit(updateDepartmentDto, ['createTime', 'updateTime', 'children'])

    const { name, parentId } = cloneUpdateDepartmentDto

    await this._validateNameRepeat(name, parentId, id)

    if (parentId === id) {
      throw new BadRequestException('父级部门不能为自身')
    }

    let { fullPath } = cloneUpdateDepartmentDto

    const { parentId: originalParentId, fullPath: originalFullPath } = await this.department.findUnique({ where: { id } })

    if (parentId !== originalParentId) {
      fullPath = parentId !== '-1' ? await this._generateFullPath(parentId, id) : id

      const promises = (await this.department.findMany({ where: { fullPath: { startsWith: originalFullPath }, NOT: { id } } })).map((department) =>
        this.department.update({ where: { id: department.id }, data: { ...department, fullPath: department.fullPath.replace(originalFullPath, fullPath) } })
      )

      await Promise.all(promises)
    }

    return this.department.update({
      where: { id },
      data: {
        ...cloneUpdateDepartmentDto,
        fullPath
      }
    })
  }

  async remove(id: string): Promise<Department> {
    const count = await this.department.count({ where: { parentId: id } })

    if (count > 0) {
      throw new BadRequestException('该部门下存在子部门，无法删除')
    }

    return this.department.delete({ where: { id } })
  }

  async _validateNameRepeat(name: string, parentId: string, id?: string) {
    const count = await this.department.count({ where: { parentId, name, NOT: { id } } })

    if (count > 0) {
      throw new BadRequestException('部门名称已存在')
    }
  }

  async _generateFullPath(parentId: string, id: string) {
    const parentDepartment = await this.department.findUnique({ where: { id: parentId } })

    if (!parentDepartment) {
      throw new BadRequestException('父级部门不存在')
    }

    return `${parentDepartment.fullPath}/${id}`
  }
}
