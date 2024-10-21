import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthStorage } from '../auth/auth.storage.js'
import { NatsTopics } from './topic.enum.js'

@Injectable()
export class WsTopicValidator {
  constructor (
    private readonly authStorage: AuthStorage
  ) {}

  validate (topic: string): void {
    if (topic.startsWith(NatsTopics.EXAMPLE)) {
      const userUuid = topic.split('.')[1]

      const authenticatedUserUuid = this.authStorage.getUserUuid()

      if (userUuid !== authenticatedUserUuid) {
        throw new UnauthorizedException()
      }
    }
  }
}
