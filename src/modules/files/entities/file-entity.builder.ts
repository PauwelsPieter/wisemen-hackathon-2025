import { randomUUID } from 'node:crypto'
import { MimeType } from '../enums/mime-type.enum.js'
import { UserUuid } from '../../../app/users/entities/user.uuid.js'
import { generateUuid } from '../../../utils/types/uuid.js'
import { generateSanitizedS3Key } from '../../s3/sanitized-s3-key.js'
import { File } from './file.entity.js'
import { FileUuid } from './file.uuid.js'

export class FileEntityBuilder {
  private file: File

  constructor () {
    this.file = new File()

    this.file.uuid = generateUuid()
    this.file.name = randomUUID()
    this.file.key = generateSanitizedS3Key()
    this.file.mimeType = MimeType.OCTET_STREAM
    this.file.isUploadConfirmed = false
    this.file.blurHash = null
    this.file.variants = []
    this.file.createdAt = new Date()
    this.file.updatedAt = new Date()
    this.file.uploaderUuid = null
  }

  withUuid (uuid: FileUuid): this {
    this.file.uuid = uuid
    return this
  }

  withName (name: string): this {
    this.file.name = name
    return this
  }

  withMimeType (mimeType: MimeType): this {
    this.file.mimeType = mimeType
    return this
  }

  withUploaderUuid (uuid: UserUuid | null): this {
    this.file.uploaderUuid = uuid
    return this
  }

  build (): File {
    return this.file
  }
}
