import { MenuType } from '@prisma/client'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class CreateMenuDto {
  @IsNotEmpty({ message: '菜单名称不能为空' })
  name: string
  code: string
  sort: number = 0
  parentId: number = -1
  @IsEnum(MenuType, { message: '菜单类型不正确' })
  type: MenuType = MenuType.CATALOG
  icon?: string
  url?: string
  componentUrl?: string
  redirectUrl?: string
  enabledStatus: boolean = true
  createTime: Date
  updateTime: Date
}
