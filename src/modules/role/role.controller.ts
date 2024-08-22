import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { RoleService } from './role.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { QueryPageRoleDto } from './dto/query-role.dto'

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto)
  }

  @Get()
  findAll() {
    return this.roleService.findAll()
  }

  @Get('page')
  findPage(@Query() queryPageRoleDto: QueryPageRoleDto) {
    return this.roleService.findPage(queryPageRoleDto)
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.roleService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto)
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.roleService.remove(id)
  }
}
