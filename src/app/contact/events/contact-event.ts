import { DomainEvent, SubjectedEventOptions } from '../../../modules/domain-events/domain-event.js'
import { DomainEventSubjectType } from '../../../modules/domain-events/domain-event-subject-type.enum.js'
import { ContactUuid } from '../entities/contact.uuid.js'

export class ContactEvent<Content extends object> extends DomainEvent<Content> {
  constructor (options: SubjectedEventOptions<Content, { contactUuid: ContactUuid }>) {
    super({
      ...options,
      subjectId: options.contactUuid,
      subjectType: DomainEventSubjectType.CONTACT
    })
  }
}
