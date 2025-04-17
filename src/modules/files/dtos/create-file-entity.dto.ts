import { ApiProperty } from '@nestjs/swagger'
import { IsNullable } from '@wisemen/validators'
import { IsString, IsUUID, Max, Min } from 'class-validator'
import { FileUuid } from '../entities/file.uuid.js'

export class CreateFileLinkDto {
  @ApiProperty({ format: 'uuid' })
  @IsString()
  @IsUUID()
  fileUuid: FileUuid

  @ApiProperty({ type: 'integer', nullable: true })
  @IsNullable()
  @Min(0)
  @Max(1000)
  order: number | null
}
