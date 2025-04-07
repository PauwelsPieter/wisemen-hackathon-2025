import { OneOfMeta } from '@wisemen/one-of'
import { ApiProperty } from '@nestjs/swagger'
import { DomainEventLog } from '../../../../modules/domain-event-log/domain-event-log.entity.js'
import { DomainEventType } from '../../../../modules/domain-events/domain-event-type.js'
import { UserEvent } from '../../events/user-event.js'

@OneOfMeta(DomainEventLog, DomainEventType.USER_CREATED)
export class UserCreatedEventContent {
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly userUuid: string

  constructor (userUuid: string) {
    this.userUuid = userUuid
  }
}

export class UserCreatedEvent extends UserEvent<UserCreatedEventContent> {
  static VERSION = 1
  static TYPE = DomainEventType.USER_CREATED

  constructor (userUuid: string) {
    super({
      userUuid,
      version: UserCreatedEvent.VERSION,
      content: new UserCreatedEventContent(userUuid),
      type: UserCreatedEvent.TYPE
    })
  }
}
