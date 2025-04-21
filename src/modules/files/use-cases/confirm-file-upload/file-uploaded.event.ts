import { OneOfMeta } from '@wisemen/one-of'
import { ApiProperty } from '@nestjs/swagger'
import { DomainEventLog } from '../../../../modules/domain-event-log/domain-event-log.entity.js'
import { DomainEventType } from '../../../../modules/domain-events/domain-event-type.js'
import { RegisterDomainEvent } from '../../../../modules/domain-events/register-domain-event.decorator.js'
import { File } from '../../entities/file.entity.js'
import { FileEvent } from '../../events/file.event.js'
import { FileUuid } from '../../entities/file.uuid.js'

@OneOfMeta(DomainEventLog, DomainEventType.FILE_UPLOADED)
export class FileUploadedEventContent {
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly fileUuid: FileUuid

  @ApiProperty({ type: 'string' })
  readonly fileName: string

  constructor (file: File) {
    this.fileUuid = file.uuid
    this.fileName = file.name
  }
}

@RegisterDomainEvent(DomainEventType.FILE_UPLOADED, 1)
export class FileUploadedEvent extends FileEvent<FileUploadedEventContent> {
  constructor (file: File) {
    super({
      fileUuid: file.uuid,
      content: new FileUploadedEventContent(file)
    })
  }
}
