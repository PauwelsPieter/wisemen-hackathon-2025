import { ApiProperty } from '@nestjs/swagger'
import { OneOfMeta } from '@wisemen/one-of'
import { NotificationType, NotificationTypeApiProperty } from '../../enums/notification-types.enum.js'
import { DomainEventLog } from '../../../domain-event-log/domain-event-log.entity.js'
import { DomainEventType } from '../../../domain-events/domain-event-type.js'
import { DomainEvent } from '../../../domain-events/domain-event.js'
import { RegisterDomainEvent } from '../../../domain-events/register-domain-event.decorator.js'
import { NotificationUuid } from '../../entities/notification.uuid.js'

@OneOfMeta(DomainEventLog, DomainEventType.NOTIFICATION_CREATED)
export class NotificationCreatedEventContent {
  @ApiProperty({ format: 'uuid' })
  readonly uuid: NotificationUuid

  @NotificationTypeApiProperty()
  readonly type: NotificationType

  constructor (uuid: NotificationUuid, type: NotificationType) {
    this.uuid = uuid
    this.type = type
  }
}

@RegisterDomainEvent(DomainEventType.NOTIFICATION_CREATED, 1)
export class NotificationCreatedEvent extends DomainEvent<NotificationCreatedEventContent> {
  constructor (uuid: NotificationUuid, type: NotificationType) {
    super({
      content: new NotificationCreatedEventContent(uuid, type)
    })
  }
}
