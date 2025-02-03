import { User } from '../users/entities/user.entity.js'
import { WiseEvent } from './wise-event.js'

export class UserRegisteredEventContent {
  public readonly userUuid: string
  public readonly userEmail: string

  constructor (user: User) {
    this.userUuid = user.uuid
    this.userEmail = user.email
  }
}

export class UserRegisteredEvent extends WiseEvent<UserRegisteredEventContent> {
  static VERSION = 1
  static TYPE = 'user.registered'

  constructor (user: User) {
    super({
      topic: UserRegisteredEvent.createTopic(user),
      version: UserRegisteredEvent.VERSION,
      content: new UserRegisteredEventContent(user),
      type: UserRegisteredEvent.TYPE,
      source: 'api'
    })
  }

  private static createTopic (forUser: User): string {
    return `users.${forUser.uuid}.registered`
  }
}
