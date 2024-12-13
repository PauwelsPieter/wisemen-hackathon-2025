import { Equals, IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { Permission } from '../../../permission/permission.enum.js'
import { PaginatedOffsetSearchQuery } from '../../../pagination/offset/paginated-offset.query.js'
import { FilterQuery } from '../../../pagination/search.query.js'

export class UsersFilterQuery extends FilterQuery {
  @ApiProperty({ enum: Permission, required: false, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions?: Permission[]
}

export class ViewUsersQuery extends PaginatedOffsetSearchQuery {
  @Equals(undefined)
  sort?: never

  @ApiProperty({ type: UsersFilterQuery })
  @IsOptional()
  @Type(() => UsersFilterQuery)
  @ValidateNested()
  filter?: UsersFilterQuery

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  search?: string
}
