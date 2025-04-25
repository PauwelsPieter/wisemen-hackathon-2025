import { MimeType } from '../enums/mime-type.enum.js'
import { FileUuid } from './file.uuid.js'
import { PresignedFileVariant } from './presigned-file-variant.type.js'

export class PresignedFile {
  uuid: FileUuid
  name: string
  mimeType: MimeType | null
  url: string
  variants: PresignedFileVariant[]
}
