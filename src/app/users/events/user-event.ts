import { DomainEvent, DomainEventOptions } from '../../../modules/domain-events/domain-event.js'
import { DomainEventSubjectType } from '../../../modules/domain-events/domain-event-subject-type.enum.js'

export class UserEvent<Content extends object> extends DomainEvent<Content> {
  constructor (
    options: Omit<DomainEventOptions<Content>, 'subjectType' | 'subjectId'> & { userUuid: string }
  ) {
    super({
      ...options,
      subjectId: options.userUuid,
      subjectType: DomainEventSubjectType.USER
    })
  }
}
