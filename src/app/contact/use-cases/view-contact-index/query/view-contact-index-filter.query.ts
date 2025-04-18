import { ApiProperty } from '@nestjs/swagger'
import { FilterQuery } from '@wisemen/pagination'
import { IsOptional, IsString } from 'class-validator'

export class ViewContactIndexFilterQuery extends FilterQuery {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  isActive?: string
}
