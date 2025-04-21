import { DomainEventSubjectType } from '../../domain-events/domain-event-subject-type.enum.js'
import { DomainEvent, DomainEventOptions } from '../../domain-events/domain-event.js'

export class FileEvent<Content extends object> extends DomainEvent<Content> {
  constructor (
    options: Omit<DomainEventOptions<Content>, 'subjectType' | 'subjectId'> & { fileUuid: string }
  ) {
    super({
      ...options,
      subjectId: options.fileUuid,
      subjectType: DomainEventSubjectType.FILE
    })
  }
}
