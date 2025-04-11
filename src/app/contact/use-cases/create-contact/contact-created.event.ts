import { ApiProperty } from '@nestjs/swagger'
import { OneOfMeta } from '@wisemen/one-of'
import { DomainEventLog } from '../../../../modules/domain-event-log/domain-event-log.entity.js'
import { DomainEventType } from '../../../../modules/domain-events/domain-event-type.js'
import { RegisterDomainEvent } from '../../../../modules/domain-events/register-domain-event.decorator.js'
import { Contact } from '../../entities/contact.entity.js'
import { ContactEvent } from '../../events/contact-event.js'

@OneOfMeta(DomainEventLog, DomainEventType.CONTACT_CREATED)
export class ContactCreatedEventContent {
  @ApiProperty({ format: 'uuid' })
  readonly contactUuid: string

  constructor (contactUuid: string) {
    this.contactUuid = contactUuid
  }
}

@RegisterDomainEvent(DomainEventType.CONTACT_CREATED, 1)
export class ContactCreatedEvent
  extends ContactEvent<ContactCreatedEventContent> {
  constructor (contact: Contact) {
    super({
      contactUuid: contact.uuid,
      content: new ContactCreatedEventContent(contact.uuid)
    })
  }
}
