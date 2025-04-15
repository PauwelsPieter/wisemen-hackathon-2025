import { OneOfMeta } from '@wisemen/one-of'
import { ApiProperty } from '@nestjs/swagger'
import { DomainEventLog } from '../../../domain-event-log/domain-event-log.entity.js'
import { DomainEventType } from '../../../domain-events/domain-event-type.js'
import { DomainEvent } from '../../../domain-events/domain-event.js'
import { RegisterDomainEvent } from '../../../domain-events/register-domain-event.decorator.js'
import { UserNotification } from '../../entities/user-notification.entity.js'
import { NotificationChannel, NotificationChannelApiProperty } from '../../enums/notification-channel.enum.js'

@OneOfMeta(DomainEventLog, DomainEventType.USER_NOTIFICATION_CREATED)
export class UserNotificationCreatedEventContent {
  @ApiProperty({ type: 'string', format: 'uuid' })
  notificationUuid: string

  @NotificationChannelApiProperty()
  channel: NotificationChannel

  @ApiProperty({ type: 'string', format: 'uuid' })
  userUuid: string

  constructor (userNotification: UserNotification) {
    this.userUuid = userNotification.userUuid
    this.notificationUuid = userNotification.notificationUuid
    this.channel = userNotification.channel
  }
}

@RegisterDomainEvent(DomainEventType.USER_NOTIFICATION_CREATED, 1)
export class UserNotificationCreatedEvent extends DomainEvent<UserNotificationCreatedEventContent> {
  constructor (userNotification: UserNotification) {
    super({
      content: new UserNotificationCreatedEventContent(userNotification)
    })
  }
}
