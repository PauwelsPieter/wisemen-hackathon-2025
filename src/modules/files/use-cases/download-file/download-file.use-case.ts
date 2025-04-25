import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { File } from '../../entities/file.entity.js'
import { FileUuid } from '../../entities/file.uuid.js'
import { PresignedFileResponse } from '../../responses/presigned-file.response.js'
import { FilePresigner } from '../../services/presign-file/file-presigner.js'

@Injectable()
export class DownloadFileUseCase {
  constructor (
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private readonly filePresigner: FilePresigner
  ) {}

  async execute (fileUuid: FileUuid): Promise<PresignedFileResponse> {
    const file = await this.fileRepository.findOneByOrFail({ uuid: fileUuid })
    const presignedFile = await this.filePresigner.presign(file)
    return new PresignedFileResponse(presignedFile)
  }
}
