import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { MimeType } from '../../enums/mime-type.enum.js'

export class CreateFileCommand {
  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  name: string

  @ApiProperty({ type: 'string', enum: MimeType, enumName: 'MimeType' })
  @IsNotEmpty()
  @IsEnum(MimeType)
  mimeType: MimeType
}
