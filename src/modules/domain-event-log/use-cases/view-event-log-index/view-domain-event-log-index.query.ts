import { Equals, IsEnum, IsObject, IsOptional, IsUUID, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsUndefinable } from '@wisemen/validators'
import { FilterQuery, PaginatedKeysetQuery, PaginatedKeysetSearchQuery } from '@wisemen/pagination'
import { DomainEventSubjectType } from '../../../domain-events/domain-event-subject-type.enum.js'
import { DomainEventSubjectTypeApiProperty } from '../../../domain-events/domain-event-subject-type.api-property.js'
import { ViewDomainEventLogIndexQueryKey } from './view-domain-event-log-index.query.key.js'

export class ViewDomainEventLogIndexPaginationQuery extends PaginatedKeysetQuery {
  @ApiProperty({ type: ViewDomainEventLogIndexQueryKey, required: false, nullable: true })
  @Type(() => ViewDomainEventLogIndexQueryKey)
  @ValidateNested()
  @IsObject()
  @IsOptional()
  key?: ViewDomainEventLogIndexQueryKey | null
}

export class ViewDomainEventLogIndexFilterQuery extends FilterQuery {
  @DomainEventSubjectTypeApiProperty({ required: false })
  @IsUndefinable()
  @IsEnum(DomainEventSubjectType)
  subjectType?: DomainEventSubjectType

  @ApiProperty({ type: 'string', format: 'uuid', required: false })
  @IsUndefinable()
  @IsUUID()
  subjectId?: string

  @ApiProperty({ type: 'string', format: 'uuid', required: false })
  @IsUndefinable()
  @IsUUID()
  userUuid?: string
}

export class ViewDomainEventLogIndexQuery extends PaginatedKeysetSearchQuery {
  @Equals(undefined)
  sort: never

  @ApiProperty({ type: ViewDomainEventLogIndexFilterQuery, required: false })
  @IsUndefinable()
  @IsObject()
  @Type(() => ViewDomainEventLogIndexFilterQuery)
  @ValidateNested()
  filter?: ViewDomainEventLogIndexFilterQuery

  @Equals(undefined)
  search: never

  @ApiProperty({ type: ViewDomainEventLogIndexPaginationQuery, required: false })
  @IsUndefinable()
  @Type(() => ViewDomainEventLogIndexPaginationQuery)
  @ValidateNested()
  @IsObject()
  pagination?: ViewDomainEventLogIndexPaginationQuery
}
