import { ApiProperty } from '@nestjs/swagger'
import { OneOfMeta } from '@wisemen/one-of'
import { DomainEventType } from '../../../domain-events/domain-event-type.js'
import { DomainEventLog } from '../../../domain-event-log/domain-event-log.entity.js'
import { UserUuid } from '../../../../app/users/entities/user.uuid.js'
import { RegisterDomainEvent } from '../../../domain-events/register-domain-event.decorator.js'
import { UserEvent } from '../../../../app/users/events/user.event.js'

@OneOfMeta(DomainEventLog, DomainEventType.USER_DEFAULT_NOTIFICATION_PREFERENCES_ASSIGNED)
export class DefaultNotificationPreferencesAssignedToUserEventContent {
  @ApiProperty({ format: 'uuid' })
  readonly userUuid: UserUuid

  constructor (uuid: UserUuid) {
    this.userUuid = uuid
  }
}

@RegisterDomainEvent(DomainEventType.USER_DEFAULT_NOTIFICATION_PREFERENCES_ASSIGNED, 1)
export class DefaultNotificationPreferencesAssignedToUserEvent
  extends UserEvent<DefaultNotificationPreferencesAssignedToUserEventContent> {
  constructor (userUuid: UserUuid) {
    super({
      userUuid,
      content: new DefaultNotificationPreferencesAssignedToUserEventContent(userUuid)
    })
  }
}
