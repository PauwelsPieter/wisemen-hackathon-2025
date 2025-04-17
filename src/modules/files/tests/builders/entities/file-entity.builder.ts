import { File } from '../../../entities/file.entity.js'
import { MimeType } from '../../../enums/mime-type.enum.js'
import { generateUserUuid, UserUuid } from '../../../../../app/users/entities/user.uuid.js'
import { FileUuid, generateFileUuid } from '../../../entities/file.uuid.js'

export class FileEntityBuilder {
  private fileEntity: File

  constructor () {
    this.reset()
  }

  reset (): this {
    this.fileEntity = new File()

    this.fileEntity.uuid = generateFileUuid()
    this.fileEntity.name = 'file.png'
    this.fileEntity.mimeType = MimeType.PNG
    this.fileEntity.userUuid = generateUserUuid()

    return this
  }

  withUuid (uuid: FileUuid): this {
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

  withUserUuid (userUuid: UserUuid): this {
    this.fileEntity.userUuid = userUuid

    return this
  }

  build (): File {
    const result = this.fileEntity

    this.reset()

    return result
  }
}
