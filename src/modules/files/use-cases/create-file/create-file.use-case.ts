import { Injectable } from '@nestjs/common'
import { InjectRepository, transaction } from '@wisemen/nestjs-typeorm'
import { DataSource, Repository } from 'typeorm'
import { File } from '../../entities/file.entity.js'
import { S3 } from '../../../s3/s3.js'
import { AuthContext } from '../../../auth/auth.context.js'
import { DomainEventEmitter } from '../../../domain-events/domain-event-emitter.js'
import { CreateFileCommand } from './create-file.command.js'
import { CreateFileResponse } from './create-file.response.js'
import { FileCreatedEvent } from './file-created.event.js'

@Injectable()
export class CreateFileUseCase {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private readonly authContext: AuthContext,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private readonly s3: S3
  ) {}

  async execute (command: CreateFileCommand): Promise<CreateFileResponse> {
    const userUuid = this.authContext.getUserUuid()

    const file = this.fileRepository.create({
      name: command.name,
      mimeType: command.mimeType,
      userUuid: userUuid
    })

    const uploadUrl = await this.s3.createTemporaryUploadUrl(file)

    await transaction(this.dataSource, async () => {
      await this.fileRepository.insert(file)
      await this.eventEmitter.emitOne(new FileCreatedEvent(file))
    })

    return new CreateFileResponse(file, uploadUrl)
  }
}
