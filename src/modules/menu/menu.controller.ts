import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { MenuService } from './menu.service'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto)
  }

  @Get()
  findAll(@Query('keywords') keywords: string) {
    return this.menuService.findAll(keywords)
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.menuService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto)
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.menuService.remove(id)
  }
}
