import { ApiProperty } from '@nestjs/swagger'
import { OneOfMeta } from '@wisemen/one-of'
import { DomainEventLog } from '../../../domain-event-log/domain-event-log.entity.js'
import { DomainEventType } from '../../../domain-events/domain-event-type.js'
import { DomainEvent } from '../../../domain-events/domain-event.js'
import { RegisterDomainEvent } from '../../../domain-events/register-domain-event.decorator.js'

@OneOfMeta(DomainEventLog, DomainEventType.NOTIFICATION_READ)
export class NotificationReadEventContent {
  @ApiProperty({ format: 'uuid' })
  readonly notificationUuid: string

  @ApiProperty({ format: 'uuid' })
  readonly userUuid: string

  constructor (notificationUuid: string, userUuid: string) {
    this.notificationUuid = notificationUuid
    this.userUuid = userUuid
  }
}

@RegisterDomainEvent(DomainEventType.NOTIFICATION_READ, 1)
export class NotificationReadEvent extends DomainEvent {
  constructor (notificationUuid: string, userUuid: string) {
    super({
      content: new NotificationReadEventContent(notificationUuid, userUuid)
    })
  }
}
