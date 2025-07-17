import { ApiProperty } from '@nestjs/swagger'
import { PresignedFileVariant } from '../entities/presigned-file-variant.type.js'
import { PresignedFile } from '../entities/presigned-file.js'
import { MimeType, MimeTypeApiProperty } from '../enums/mime-type.enum.js'

export class PresignedFileVariantResponse {
  @ApiProperty({ type: 'string' })
  label: string

  @ApiProperty({ type: 'string' })
  url: string

  constructor (variant: PresignedFileVariant) {
    this.label = variant.label
    this.url = variant.url
  }
}

export class PresignedFileResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  uuid: string

  @ApiProperty({ type: 'string' })
  name: string

  @MimeTypeApiProperty({ nullable: true })
  mimeType: MimeType | null

  @ApiProperty({ type: 'string' })
  url: string

  @ApiProperty({ type: 'string', nullable: true })
  blurHash: string | null

  @ApiProperty({ type: PresignedFileVariantResponse, isArray: true })
  variants: PresignedFileVariantResponse[]

  constructor (file: PresignedFile) {
    this.uuid = file.uuid
    this.name = file.name
    this.mimeType = file.mimeType
    this.url = file.url
    this.blurHash = file.blurHash
    this.variants = file.variants.map(variant => new PresignedFileVariantResponse(variant))
  }
}
