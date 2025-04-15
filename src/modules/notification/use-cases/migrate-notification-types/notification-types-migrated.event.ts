import { OneOfMeta } from '@wisemen/one-of'
import { NotificationType, NotificationTypeApiProperty } from '../../enums/notification-types.enum.js'
import { DomainEventLog } from '../../../domain-event-log/domain-event-log.entity.js'
import { DomainEventType } from '../../../domain-events/domain-event-type.js'
import { DomainEvent } from '../../../domain-events/domain-event.js'
import { RegisterDomainEvent } from '../../../domain-events/register-domain-event.decorator.js'

@OneOfMeta(DomainEventLog, DomainEventType.NOTIFICATION_TYPES_MIGRATED)
export class NotificationTypesMigratedEventContent {
  @NotificationTypeApiProperty({ isArray: true })
  readonly types: NotificationType[]

  constructor (types: NotificationType[]) {
    this.types = types
  }
}

@RegisterDomainEvent(DomainEventType.NOTIFICATION_TYPES_MIGRATED, 1)
export class NotificationTypesMigratedEvent extends DomainEvent {
  constructor (types: NotificationType[]) {
    super({
      content: new NotificationTypesMigratedEventContent(types)
    })
  }
}
