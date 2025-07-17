import { ApiProperty } from '@nestjs/swagger'
import { IsNullable } from '@wisemen/validators'
import { IsString, MaxLength } from 'class-validator'

export class ConfirmFileUploadCommand {
  @ApiProperty({ type: String, nullable: true, maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsNullable()
  blurHash: string | null
}
