import { ApiProperty } from '@nestjs/swagger'
import { PaginatedKeysetQuery } from '@wisemen/pagination'
import { Type } from 'class-transformer'
import { ValidateNested, IsObject, IsOptional } from 'class-validator'
import { ViewJobsIndexQueryKey } from './view-jobs-index.query-key.js'

export class ViewJobsIndexPaginationQuery extends PaginatedKeysetQuery {
  @ApiProperty({ type: ViewJobsIndexQueryKey, required: false, nullable: true })
  @Type(() => ViewJobsIndexQueryKey)
  @ValidateNested()
  @IsObject()
  @IsOptional()
  key?: ViewJobsIndexQueryKey | null
}
