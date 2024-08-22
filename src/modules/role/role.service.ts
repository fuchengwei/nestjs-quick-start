import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaClient, Role } from '@prisma/client'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { QueryPageRoleDto } from './dto/query-role.dto'
import { PaginationResponse } from '@/model/pagination.model'

@Injectable()
export class RoleService extends PrismaClient {
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name, code, menus } = createRoleDto

    await this._validateNameOrCodeRepeat(name, code)

    return this.role.create({
      data: {
        ...createRoleDto,
        menus: {
          connect: menus
        }
      }
    })
  }

  findAll(): Promise<Role[]> {
    return this.role.findMany()
  }

  async findPage(queryPageRoleDto: QueryPageRoleDto): Promise<PaginationResponse<Role>> {
    const { skip, take, keywords } = queryPageRoleDto

    const roles = await this.role.findMany({
      skip: skip * take,
      take,
      where: { OR: [{ name: { contains: keywords } }, { code: { contains: keywords } }] },
      orderBy: { sort: 'asc' }
    })
    const total = await this.role.count({ where: { OR: [{ name: { contains: keywords } }, { code: { contains: keywords } }] } })

    return new PaginationResponse(roles, total, queryPageRoleDto)
  }

  findOne(id: number): Promise<Role | null> {
    return this.role.findUnique({ where: { id }, include: { menus: true } })
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const { name, code, menus } = updateRoleDto

    await this._validateNameOrCodeRepeat(name, code, id)

    return this.role.update({ where: { id }, data: { ...updateRoleDto, menus: { set: menus } } })
  }

  remove(id: number): Promise<Role> {
    return this.role.delete({ where: { id } })
  }

  async _validateNameOrCodeRepeat(name: string, code: string, id?: number) {
    const count = await this.role.count({ where: { OR: [{ name }, { code }], NOT: { id } } })

    if (count > 0) {
      throw new BadRequestException('角色名称或编码已存在')
    }
  }
}
