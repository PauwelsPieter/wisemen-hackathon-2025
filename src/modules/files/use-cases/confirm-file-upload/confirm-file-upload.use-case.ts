import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { File } from '../../entities/file.entity.js'
import { AuthStorage } from '../../../auth/auth.storage.js'

@Injectable()
export class ConfirmFileUploadUseCase {
  constructor (
    private readonly authStorage: AuthStorage,
    @InjectRepository(File)
    private fileRepository: Repository<File>
  ) {}

  async execute (fileUuid: string): Promise<void> {
    const userUuid = this.authStorage.getUserUuid()
    const file = await this.fileRepository.findOneByOrFail({
      uuid: fileUuid,
      userUuid: userUuid
    })

    await this.fileRepository.update(
      { uuid: file.uuid },
      { isUploadConfirmed: true }
    )
  }
}
