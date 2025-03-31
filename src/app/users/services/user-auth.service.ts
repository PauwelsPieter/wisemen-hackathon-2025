import { Injectable } from '@nestjs/common'
import { User } from '../entities/user.entity.js'
import { RedisClient } from '../../../modules/redis/redis.client.js'
import { TokenContent } from '../../../modules/auth/middleware/auth.middleware.js'
import { AuthContent } from '../../../modules/auth/auth.context.js'
import {
  GetOrCreateUserCommandBuilder
} from '../use-cases/get-or-create-user/get-or-create-user.command.builder.js'
import {
  GetOrCreateUserUseCase
} from '../use-cases/get-or-create-user/get-or-create-user.use-case.js'

@Injectable()
export class UserAuthService {
  constructor (
    private readonly redisClient: RedisClient,
    private readonly getOrCreateUserUseCase: GetOrCreateUserUseCase
  ) {}

  async findOneByUserId (token: TokenContent): Promise<AuthContent> {
    const cacheKey = `auth:${token.sub}`

    const cachedUser = await this.redisClient.getCachedValue(cacheKey)

    if (cachedUser != null) {
      return JSON.parse(cachedUser) as AuthContent
    }

    const user = await this.fetchOrCreateUser(token)

    const response: AuthContent = {
      uuid: user.uuid,
      userId: user.userId
    }

    await this.redisClient.putCachedValue(cacheKey, JSON.stringify(response))

    return user
  }

  private async fetchOrCreateUser (token: TokenContent): Promise<User> {
    const command = new GetOrCreateUserCommandBuilder()
      .withEmail(token.email)
      .withId(token.sub)
      .build()

    return await this.getOrCreateUserUseCase.getOrCreateUser(command)
  }
}
