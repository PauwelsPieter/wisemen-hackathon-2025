import { ApiProperty } from '@nestjs/swagger'
import { MimeType, MimeTypeApiProperty } from '../enums/mime-type.enum.js'
import { File } from '../entities/file.entity.js'

export class FileResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  uuid: string

  @ApiProperty({ type: 'string' })
  name: string

  @MimeTypeApiProperty()
  mimeType: MimeType

  @ApiProperty({ type: 'string', nullable: true })
  blurHash: string | null

  constructor (file: File) {
    this.uuid = file.uuid
    this.name = file.name
    this.mimeType = file.mimeType
    this.blurHash = file.blurHash
  }
}
