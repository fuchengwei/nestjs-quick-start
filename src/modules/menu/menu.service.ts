import { BadRequestException, Injectable } from '@nestjs/common'
import { Menu, PrismaClient } from '@prisma/client'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { listToTree } from '@/utils/list-to-tree'

@Injectable()
export class MenuService extends PrismaClient {
  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const { name, parentId } = createMenuDto

    await this._validateNameRepeat(name, parentId)

    return this.menu.create({ data: createMenuDto })
  }

  async findAll(keywords: string): Promise<Menu[]> {
    const menus = await this.menu.findMany({ where: { OR: [{ name: { contains: keywords } }, { code: { contains: keywords } }] } })

    return listToTree(menus)
  }

  findOne(id: number): Promise<Menu | null> {
    return this.menu.findUnique({ where: { id } })
  }

  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const { name, parentId } = updateMenuDto

    await this._validateNameRepeat(name, parentId, id)

    if (parentId === id) {
      throw new BadRequestException('父级菜单不能为自身')
    }

    return this.menu.update({ where: { id }, data: updateMenuDto })
  }

  async remove(id: number): Promise<Menu> {
    const count = await this.menu.count({ where: { parentId: id } })

    if (count > 0) {
      throw new BadRequestException('该菜单下存在子菜单，无法删除')
    }

    return this.menu.delete({ where: { id } })
  }

  async _validateNameRepeat(name: string, parentId: number, id?: number) {
    const count = await this.menu.count({ where: { parentId, name, NOT: { id } } })

    if (count > 0) {
      throw new BadRequestException('菜单名称已存在')
    }
  }
}
