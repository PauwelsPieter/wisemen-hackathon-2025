import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { File } from '../../entities/file.entity.js'
import { AuthStorage } from '../../../auth/auth.storage.js'
import { S3Service } from '../../services/s3.service.js'
import { CreateFileCommand } from './create-file.command.js'
import { CreateFileResponse } from './create-file.response.js'

@Injectable()
export class CreateFileUseCase {
  constructor (
    private readonly authStorage: AuthStorage,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private readonly s3Service: S3Service
  ) {}

  async execute (command: CreateFileCommand): Promise<CreateFileResponse> {
    const userUuid = this.authStorage.getUserUuid()

    const file = this.fileRepository.create({
      name: command.name,
      mimeType: command.mimeType,
      userUuid: userUuid
    })

    await this.fileRepository.insert(file)

    const uploadUrl = await this.s3Service.createTemporaryUploadUrl(file)

    return new CreateFileResponse(file, uploadUrl)
  }
}
