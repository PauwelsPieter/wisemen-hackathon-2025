import { randomUUID } from 'node:crypto'
import { v4 } from 'uuid'
import { File } from '../../../entities/file.entity.js'
import { MimeType } from '../../../enums/mime-type.enum.js'

export class FileEntityBuilder {
  private fileEntity: File

  constructor () {
    this.reset()
  }

  reset (): this {
    this.fileEntity = new File()

    this.fileEntity.uuid = randomUUID()
    this.fileEntity.name = 'file.png'
    this.fileEntity.mimeType = MimeType.PNG
    this.fileEntity.userUuid = v4()

    return this
  }

  withUuid (uuid: string): this {
    this.fileEntity.uuid = uuid

    return this
  }

  withName (name: string): this {
    this.fileEntity.name = name

    return this
  }

  withMimeType (mimeType: MimeType): this {
    this.fileEntity.mimeType = mimeType

    return this
  }

  withUserUuid (userUuid: string): this {
    this.fileEntity.userUuid = userUuid

    return this
  }

  build (): File {
    const result = this.fileEntity

    this.reset()

    return result
  }
}
