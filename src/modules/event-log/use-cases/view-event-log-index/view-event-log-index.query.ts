import { Equals, IsObject, IsOptional, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsUndefinable } from '@wisemen/validators'
import { PaginatedKeysetQuery, PaginatedKeysetSearchQuery } from '@wisemen/pagination'
import { ViewEventLogIndexQueryKey } from './view-event-log-index.query.key.js'

export class ViewEventLogIndexPaginationQuery extends PaginatedKeysetQuery {
  @ApiProperty({ type: ViewEventLogIndexQueryKey, required: false, nullable: true })
  @Type(() => ViewEventLogIndexQueryKey)
  @ValidateNested()
  @IsObject()
  @IsOptional()
  key?: ViewEventLogIndexQueryKey | null
}

export class ViewEventLogIndexQuery extends PaginatedKeysetSearchQuery {
  @Equals(undefined)
  sort: never

  @Equals(undefined)
  filter: never

  @Equals(undefined)
  search: never

  @ApiProperty({ type: ViewEventLogIndexPaginationQuery, required: false })
  @IsUndefinable()
  @Type(() => ViewEventLogIndexPaginationQuery)
  @ValidateNested()
  @IsObject()
  pagination?: ViewEventLogIndexPaginationQuery
}
