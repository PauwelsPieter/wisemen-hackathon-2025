import { Equals, IsOptional, IsString, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { PaginatedOffsetSearchQuery } from '../../../../utils/pagination/offset/paginated-offset.query.js'
import { FilterQuery } from '../../../../utils/query/search.query.js'

export class ViewContactsFilterQuery extends FilterQuery {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  isActive?: string
}

export class ViewContactsQuery extends PaginatedOffsetSearchQuery {
  @Equals(undefined)
  sort: never

  @ApiProperty({ type: ViewContactsFilterQuery, required: false })
  @IsOptional()
  @Type(() => ViewContactsFilterQuery)
  @ValidateNested()
  filter?: ViewContactsFilterQuery

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  search?: string
}
