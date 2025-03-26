import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { File } from '../../entities/file.entity.js'
import { AuthStorage } from '../../../auth/auth.storage.js'
import { S3Service } from '../../services/s3.service.js'

@Injectable()
export class DownloadFileUseCase {
  constructor (
    private readonly authStorage: AuthStorage,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private readonly s3Service: S3Service
  ) {}

  async execute (fileUuid: string): Promise<{ file: File, temporaryUrl: string }> {
    const userUuid = this.authStorage.getUserUuid()
    const file = await this.fileRepository.findOneByOrFail({
      uuid: fileUuid,
      userUuid: userUuid
    })
    const temporaryUrl = await this.s3Service.createTemporaryDownloadUrl(
      file.name,
      file.uuid,
      file.mimeType
    )

    return { file, temporaryUrl }
  }
}
