import { IsNotEmpty } from 'class-validator'

export class Pagination {
  @IsNotEmpty()
  skip: number
  @IsNotEmpty()
  take: number
}

export class PaginationResponse<T> {
  list: T[]
  total: number
  currentPage: number
  nextPage: number
  hasNextPage: boolean

  constructor(list: T[], total: number, pagination: Pagination) {
    this.list = list
    this.total = total
    this.currentPage = pagination.skip
    this.nextPage = this.currentPage + 1
    this.hasNextPage = this.nextPage < Math.ceil(total / pagination.take)
  }
}
