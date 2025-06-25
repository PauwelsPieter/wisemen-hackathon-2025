import { Injectable } from '@nestjs/common'
import { InjectRepository, transaction } from '@wisemen/nestjs-typeorm'
import { Repository, DataSource } from 'typeorm'
import { File } from '../../entities/file.entity.js'
import { AuthContext } from '../../../auth/auth.context.js'
import { DomainEventEmitter } from '../../../domain-events/domain-event-emitter.js'
import { FileUuid } from '../../entities/file.uuid.js'
import { FileNotFoundError } from '../../errors/file.not-found.error.js'
import { FileUploadedEvent } from './file-uploaded.event.js'

@Injectable()
export class ConfirmFileUploadUseCase {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private readonly authContext: AuthContext,
    @InjectRepository(File)
    private fileRepository: Repository<File>
  ) {}

  async execute (fileUuid: FileUuid): Promise<void> {
    const file = await this.fileRepository.findOneBy({ uuid: fileUuid })

    if (file === null) {
      throw new FileNotFoundError(fileUuid)
    }

    await transaction(this.dataSource, async () => {
      await this.fileRepository.update(
        { uuid: file.uuid },
        { isUploadConfirmed: true }
      )
      await this.eventEmitter.emitOne(new FileUploadedEvent(file))
    })
  }
}
