import { Module } from '@nestjs/common'
import { DepartmentModule } from './modules/department/department.module'

@Module({
  imports: [DepartmentModule],
  controllers: [],
  providers: []
})
export class AppModule {}
