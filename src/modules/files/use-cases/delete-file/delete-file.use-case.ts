import { Injectable } from '@nestjs/common'
import { InjectRepository, transaction } from '@wisemen/nestjs-typeorm'
import { Repository, DataSource } from 'typeorm'
import { File } from '../../entities/file.entity.js'
import { AuthContext } from '../../../auth/auth.context.js'
import { DomainEventEmitter } from '../../../domain-events/domain-event-emitter.js'
import { FileUuid } from '../../entities/file.uuid.js'
import { FileDeletedEvent } from './file-deleted.event.js'

@Injectable()
export class DeleteFileUseCase {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private readonly authContext: AuthContext,
    @InjectRepository(File)
    private fileRepository: Repository<File>
  ) {}

  async execute (fileUuid: FileUuid): Promise<void> {
    const userUuid = this.authContext.getUserUuidOrFail()
    const file = await this.fileRepository.findOneByOrFail({
      uuid: fileUuid,
      userUuid: userUuid
    })

    await transaction(this.dataSource, async () => {
      await this.fileRepository.delete({ uuid: file.uuid })
      await this.eventEmitter.emitOne(new FileDeletedEvent(file))
    })
  }
}
