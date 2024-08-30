import { Menu, Role, SexType } from '@prisma/client'
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty({ message: '昵称不能为空' })
  nickname: string
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能小于6位' })
  password: string
  @IsPhoneNumber(null, { message: '手机号格式不正确' })
  phone: string
  @IsEmail(null, { message: '邮箱格式不正确' })
  email: string
  @IsEnum(SexType, { message: '性别不正确' })
  sex: SexType
  departmentId?: string
  roles: Role[]
  menus: Menu[]
  enabledStatus: boolean = true
  createTime: Date
  updateTime: Date
}
