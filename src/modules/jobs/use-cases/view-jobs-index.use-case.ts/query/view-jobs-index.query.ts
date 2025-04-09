import { Equals, IsObject, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsUndefinable } from '@wisemen/validators'
import { PaginatedKeysetSearchQuery } from '@wisemen/pagination'
import { ViewJobsIndexSortQuery } from './view-jobs-index.sort-query.js'
import { ViewJobsIndexFilterQuery } from './view-jobs-index.filter-query.js'
import { ViewJobsIndexPaginationQuery } from './view-jobs-index.pagination-query.js'

export class ViewJobsIndexQuery extends PaginatedKeysetSearchQuery {
  @ApiProperty({ type: ViewJobsIndexSortQuery, required: false, isArray: true })
  @Type(() => ViewJobsIndexSortQuery)
  @ValidateNested()
  @IsObject()
  @IsUndefinable()
  sort?: ViewJobsIndexSortQuery[]

  @ApiProperty({ type: ViewJobsIndexFilterQuery, required: false })
  @Type(() => ViewJobsIndexFilterQuery)
  @ValidateNested()
  @IsObject()
  @IsUndefinable()
  filter?: ViewJobsIndexFilterQuery

  @Equals(undefined)
  search: never

  @ApiProperty({ type: ViewJobsIndexPaginationQuery, required: false })
  @IsUndefinable()
  @Type(() => ViewJobsIndexPaginationQuery)
  @ValidateNested()
  @IsObject()
  pagination?: ViewJobsIndexPaginationQuery
}
