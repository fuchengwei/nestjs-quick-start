import { Module } from '@nestjs/common'
import { DepartmentModule } from './modules/department/department.module'
import { MenuModule } from './modules/menu/menu.module'

@Module({
  imports: [DepartmentModule, MenuModule],
  controllers: [],
  providers: []
})
export class AppModule {}
