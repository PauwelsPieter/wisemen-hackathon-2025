import { ApiProperty } from '@nestjs/swagger'
import { IsQueryBoolean, IsUndefinable } from '@wisemen/validators'

export class ViewJobDetailQuery {
  @ApiProperty({ type: 'boolean' })
  @IsUndefinable()
  @IsQueryBoolean()
  isArchived?: 'true' | 'false'
}
