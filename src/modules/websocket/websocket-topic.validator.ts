import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthContext } from '../auth/auth.context.js'
import { NatsTopics } from './topic.enum.js'

@Injectable()
export class WebsocketTopicValidator {
  constructor (
    private readonly authContext: AuthContext
  ) {}

  validate (topic: string): void {
    if (topic.startsWith(NatsTopics.EXAMPLE)) {
      const userUuid = topic.split('.')[1]

      const authenticatedUserUuid = this.authContext.getUserUuidOrFail()

      if (userUuid !== authenticatedUserUuid) {
        throw new UnauthorizedException()
      }
    }
  }
}
