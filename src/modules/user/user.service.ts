import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaClient, User } from '@prisma/client'
import { hashSync } from 'bcrypt'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { QueryPageUserDto } from './dto/query-user.dto'
import { PaginationResponse } from '@/model/pagination.model'

@Injectable()
export class UserService extends PrismaClient {
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { phone, password, menus, roles } = createUserDto

    await this._validatePhoneRepeat(phone)

    return this.user.create({
      data: {
        ...createUserDto,
        password: hashSync(password, 10),
        menus: {
          connect: menus
        },
        roles: {
          connect: roles
        }
      }
    })
  }

  findAll(): Promise<User[]> {
    return this.user.findMany()
  }

  async findPage(queryPageUserDto: QueryPageUserDto): Promise<PaginationResponse<User>> {
    const { skip, take, keywords } = queryPageUserDto

    const roles = await this.user.findMany({
      skip: skip * take,
      take,
      where: { nickname: { contains: keywords } },
      orderBy: { createTime: 'asc' }
    })
    const total = await this.user.count({ where: { nickname: { contains: keywords } } })

    return new PaginationResponse(roles, total, queryPageUserDto)
  }

  findOne(id: number): Promise<User | null> {
    return this.user.findUnique({ where: { id }, include: { menus: true, roles: true } })
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { phone, menus, roles } = updateUserDto

    delete updateUserDto.password

    await this._validatePhoneRepeat(phone, id)

    return this.user.update({ where: { id }, data: { ...updateUserDto, menus: { set: menus }, roles: { set: roles } } })
  }

  remove(id: number): Promise<User> {
    return this.user.delete({ where: { id } })
  }

  async _validatePhoneRepeat(phone: string, id?: number) {
    const count = await this.user.count({ where: { phone, NOT: { id } } })

    if (count > 0) {
      throw new BadRequestException('手机号已被注册')
    }
  }
}
