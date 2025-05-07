import { ApiProperty } from '@nestjs/swagger'
import { OneOfMeta } from '@wisemen/one-of'
import { DomainEventLog } from '../../../domain-event-log/domain-event-log.entity.js'
import { DomainEventType } from '../../../domain-events/domain-event-type.js'
import { DomainEvent } from '../../../domain-events/domain-event.js'
import { RegisterDomainEvent } from '../../../domain-events/register-domain-event.decorator.js'
import { UserUuid } from '../../../../app/users/entities/user.uuid.js'

@OneOfMeta(DomainEventLog, DomainEventType.NOTIFICATION_READ_ALL)
export class AllNotificationsMarkedAsReadEventContent {
  @ApiProperty({ format: 'uuid' })
  readonly userUuid: UserUuid

  constructor (userUuid: UserUuid) {
    this.userUuid = userUuid
  }
}

@RegisterDomainEvent(DomainEventType.NOTIFICATION_READ_ALL, 1)
export class AllNotificationMarkedAsReadEvent extends DomainEvent {
  constructor (userUuid: UserUuid) {
    super({
      content: new AllNotificationsMarkedAsReadEventContent(userUuid)
    })
  }
}
