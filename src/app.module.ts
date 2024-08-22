import { Module } from '@nestjs/common'
import { DepartmentModule } from './modules/department/department.module'
import { MenuModule } from './modules/menu/menu.module'
import { RoleModule } from './modules/role/role.module'

@Module({
  imports: [DepartmentModule, MenuModule, RoleModule],
  controllers: [],
  providers: []
})
export class AppModule {}
