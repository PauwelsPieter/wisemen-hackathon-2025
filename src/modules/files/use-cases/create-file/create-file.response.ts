import { ApiProperty } from '@nestjs/swagger'
import { MimeType } from '../../enums/mime-type.enum.js'
import { File } from '../../entities/file.entity.js'

export class CreateFileResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  uuid: string

  @ApiProperty({ type: 'string' })
  name: string

  @ApiProperty({ enum: MimeType, enumName: 'MimeType', nullable: true })
  mimeType: MimeType | null

  @ApiProperty({ type: 'string' })
  uploadUrl: string

  constructor (file: File, uploadUrl: string) {
    this.uuid = file.uuid
    this.name = file.name
    this.mimeType = file.mimeType
    this.uploadUrl = uploadUrl
  }
}
