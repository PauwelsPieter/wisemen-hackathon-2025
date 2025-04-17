import { ApiProperty } from '@nestjs/swagger'
import { OneOfMeta } from '@wisemen/one-of'
import { DomainEventLog } from '../../../../modules/domain-event-log/domain-event-log.entity.js'
import { DomainEventType } from '../../../../modules/domain-events/domain-event-type.js'
import { RegisterDomainEvent } from '../../../../modules/domain-events/register-domain-event.decorator.js'
import { ContactEvent } from '../../events/contact-event.js'
import { ContactUuid } from '../../entities/contact.uuid.js'

@OneOfMeta(DomainEventLog, DomainEventType.CONTACT_UPDATED)
export class ContactUpdatedEventContent {
  @ApiProperty({ format: 'uuid' })
  readonly contactUuid: string

  constructor (contactUuid: string) {
    this.contactUuid = contactUuid
  }
}

@RegisterDomainEvent(DomainEventType.CONTACT_UPDATED, 1)
export class ContactUpdatedEvent
  extends ContactEvent<ContactUpdatedEventContent> {
  constructor (contactUuid: ContactUuid) {
    super({
      contactUuid,
      content: new ContactUpdatedEventContent(contactUuid)
    })
  }
}
