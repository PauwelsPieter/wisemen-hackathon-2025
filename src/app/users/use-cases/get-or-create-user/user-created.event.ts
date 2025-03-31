import { OneOfMeta } from '@wisemen/one-of'
import { ApiProperty } from '@nestjs/swagger'
import { EventLog } from '../../../../modules/event-log/event-log.entity.js'
import { EventType } from '../../../../modules/events/event-type.js'
import { UserEvent } from '../../events/user-event.js'

@OneOfMeta(EventLog, EventType.USER_CREATED)
export class UserCreatedEventContent {
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly userUuid: string

  constructor (userUuid: string) {
    this.userUuid = userUuid
  }
}

export class UserCreatedEvent extends UserEvent<UserCreatedEventContent> {
  static VERSION = 1
  static TYPE = EventType.USER_CREATED

  constructor (userUuid: string) {
    super({
      userUuid,
      topic: UserCreatedEvent.createTopic(userUuid),
      version: UserCreatedEvent.VERSION,
      content: new UserCreatedEventContent(userUuid),
      type: UserCreatedEvent.TYPE
    })
  }

  private static createTopic (userUuid: string): string {
    return `user.${userUuid}.created`
  }
}
