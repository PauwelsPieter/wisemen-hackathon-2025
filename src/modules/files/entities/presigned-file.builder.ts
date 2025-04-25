import { randomUUID } from 'node:crypto'
import { MimeType } from '../enums/mime-type.enum.js'
import { FileUuid, generateFileUuid } from './file.uuid.js'
import { PresignedFile } from './presigned-file.js'
import { File } from './file.entity.js'
import { PresignedFileVariant } from './presigned-file-variant.type.js'

export class PresignedFileBuilder {
  private file: PresignedFile

  constructor () {
    this.file = new PresignedFile()
    this.file.uuid = generateFileUuid()
    this.file.name = randomUUID()
    this.file.mimeType = null
    this.file.url = ''
    this.file.variants = []
  }

  withUuid (uuid: FileUuid): this {
    this.file.uuid = uuid
    return this
  }

  withName (name: string): this {
    this.file.name = name
    return this
  }

  withMimeType (type: MimeType | null): this {
    this.file.mimeType = type
    return this
  }

  withUrl (url: string): this {
    this.file.url = url
    return this
  }

  withVariants (variants: PresignedFileVariant[]): this {
    this.file.variants = variants
    return this
  }

  addVariant (variant: PresignedFileVariant): this {
    this.file.variants.push(variant)
    return this
  }

  withFile (file: File): this {
    return this.withUuid(file.uuid)
      .withName(file.name)
      .withMimeType(file.mimeType)
  }

  build (): PresignedFile {
    return this.file
  }
}
