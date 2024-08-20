import { IsNotEmpty } from 'class-validator'

export class CreateDepartmentDto {
  @IsNotEmpty({ message: '部门名称不能为空' })
  name: string
  description?: string
  sort: number = 0
  parentId: string = '-1'
  fullPath: string
  enabledStatus: boolean = true
  createTime: Date
  updateTime: Date
}
