import { Equals, IsOptional, IsString, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { FilterQuery, PaginatedOffsetSearchQuery } from '@wisemen/pagination'

export class ViewContactIndexFilterQuery extends FilterQuery {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  isActive?: string
}

export class ViewContactIndexQuery extends PaginatedOffsetSearchQuery {
  @Equals(undefined)
  sort?: never

  @ApiProperty({ type: ViewContactIndexFilterQuery, required: false })
  @IsOptional()
  @Type(() => ViewContactIndexFilterQuery)
  @ValidateNested()
  filter?: ViewContactIndexFilterQuery

  @Equals(undefined)
  search?: never
}
