import { ApiProperty } from '@nestjs/swagger'
import { SortQuery, SortDirectionApiProperty, SortDirection } from '@wisemen/pagination'
import { IsEnum } from 'class-validator'

export enum ViewJobsIndexSortQueryKey {
  CREATED_AT = 'createdAt'
}

export class ViewJobsIndexSortQuery extends SortQuery {
  @ApiProperty({ enum: ViewJobsIndexSortQueryKey, enumName: 'ViewJobsIndexSortQueryKey' })
  @IsEnum(ViewJobsIndexSortQueryKey)
  key: ViewJobsIndexSortQueryKey

  @SortDirectionApiProperty()
  @IsEnum(SortDirection)
  order: SortDirection
}
