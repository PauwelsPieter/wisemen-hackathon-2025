import { DomainEventSubjectType } from '../../domain-events/domain-event-subject-type.enum.js'
import { DomainEvent, SubjectedEventOptions } from '../../domain-events/domain-event.js'
import { FileUuid } from '../entities/file.uuid.js'

export class FileEvent<Content extends object> extends DomainEvent<Content> {
  constructor (options: SubjectedEventOptions<Content, { fileUuid: FileUuid }>) {
    super({
      ...options,
      subjectId: options.fileUuid,
      subjectType: DomainEventSubjectType.FILE
    })
  }
}
