import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { File } from '../../entities/file.entity.js'
import { AuthContext } from '../../../auth/auth.context.js'

@Injectable()
export class DeleteFileUseCase {
  constructor (
    private readonly authStorage: AuthContext,
    @InjectRepository(File)
    private fileRepository: Repository<File>
  ) {}

  async execute (fileUuid: string): Promise<void> {
    const userUuid = this.authStorage.getUserUuidOrFail()
    const file = await this.fileRepository.findOneByOrFail({
      uuid: fileUuid,
      userUuid: userUuid
    })

    await this.fileRepository.delete({ uuid: file.uuid })
  }
}
