import { ApiProperty } from '@nestjs/swagger'
import { OneOfMeta } from '@wisemen/one-of'
import { DomainEventLog } from '../../../../modules/domain-event-log/domain-event-log.entity.js'
import { DomainEventType } from '../../../../modules/domain-events/domain-event-type.js'
import { RegisterDomainEvent } from '../../../../modules/domain-events/register-domain-event.decorator.js'
import { ContactEvent } from '../../events/contact-event.js'

@OneOfMeta(DomainEventLog, DomainEventType.CONTACT_DELETED)
export class ContactDeletedEventContent {
  @ApiProperty({ format: 'uuid' })
  readonly contactUuid: string

  constructor (contactUuid: string) {
    this.contactUuid = contactUuid
  }
}

@RegisterDomainEvent(DomainEventType.CONTACT_DELETED, 1)
export class ContactDeletedEvent
  extends ContactEvent<ContactDeletedEventContent> {
  constructor (contactUuid: string) {
    super({
      contactUuid,
      content: new ContactDeletedEventContent(contactUuid)
    })
  }
}
