import { Equals, IsObject, IsOptional, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsUndefinable } from '@wisemen/validators'
import { PaginatedKeysetQuery, PaginatedKeysetSearchQuery } from '@wisemen/pagination'
import { ViewDomainEventLogIndexQueryKey } from './view-domain-event-log-index.query.key.js'

export class ViewDomainEventLogIndexPaginationQuery extends PaginatedKeysetQuery {
  @ApiProperty({ type: ViewDomainEventLogIndexQueryKey, required: false, nullable: true })
  @Type(() => ViewDomainEventLogIndexQueryKey)
  @ValidateNested()
  @IsObject()
  @IsOptional()
  key?: ViewDomainEventLogIndexQueryKey | null
}

export class ViewDomainEventLogIndexQuery extends PaginatedKeysetSearchQuery {
  @Equals(undefined)
  sort: never

  @Equals(undefined)
  filter: never

  @Equals(undefined)
  search: never

  @ApiProperty({ type: ViewDomainEventLogIndexPaginationQuery, required: false })
  @IsUndefinable()
  @Type(() => ViewDomainEventLogIndexPaginationQuery)
  @ValidateNested()
  @IsObject()
  pagination?: ViewDomainEventLogIndexPaginationQuery
}
