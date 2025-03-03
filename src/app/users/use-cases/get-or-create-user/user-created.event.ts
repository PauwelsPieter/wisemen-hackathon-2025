import { WiseEvent } from '../../../../modules/events/wise-event.js'

export class UserCreatedEventContent {
  readonly userUuid: string

  constructor (userUuid: string) {
    this.userUuid = userUuid
  }
}

export class UserCreatedEvent extends WiseEvent<UserCreatedEventContent> {
  static VERSION = 1
  static TYPE = 'user.created'

  constructor (userUuid: string) {
    super({
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
