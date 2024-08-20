import { PartialType } from '@nestjs/mapped-types'
import { Department } from '@prisma/client'
import { CreateDepartmentDto } from './create-department.dto'

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
  children?: Department[]
}
