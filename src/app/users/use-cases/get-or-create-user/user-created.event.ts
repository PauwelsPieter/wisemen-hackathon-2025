import { OneOfMeta } from '@wisemen/one-of'
import { ApiProperty } from '@nestjs/swagger'
import { DomainEventLog } from '../../../../modules/domain-event-log/domain-event-log.entity.js'
import { DomainEventType } from '../../../../modules/domain-events/domain-event-type.js'
import { UserEvent } from '../../events/user.event.js'
import { RegisterDomainEvent } from '../../../../modules/domain-events/register-domain-event.decorator.js'
import { UserUuid } from '../../entities/user.uuid.js'

@OneOfMeta(DomainEventLog, DomainEventType.USER_CREATED)
export class UserCreatedEventContent {
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly userUuid: UserUuid

  constructor (userUuid: UserUuid) {
    this.userUuid = userUuid
  }
}

@RegisterDomainEvent(DomainEventType.USER_CREATED, 1)
export class UserCreatedEvent extends UserEvent<UserCreatedEventContent> {
  constructor (userUuid: UserUuid) {
    super({
      userUuid,
      content: new UserCreatedEventContent(userUuid)
    })
  }
}
