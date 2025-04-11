import { DomainEvent, DomainEventOptions } from '../../../modules/domain-events/domain-event.js'
import { DomainEventSubjectType } from '../../../modules/domain-events/domain-event-subject-type.enum.js'

export class ContactEvent<Content extends object> extends DomainEvent<Content> {
  constructor (
    options: Omit<DomainEventOptions<Content>, 'subjectType' | 'subjectId'> & { contactUuid: string }
  ) {
    super({
      ...options,
      subjectId: options.contactUuid,
      subjectType: DomainEventSubjectType.CONTACT
    })
  }
}
