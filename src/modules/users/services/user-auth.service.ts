import { Injectable } from '@nestjs/common'
import { UserRepository } from '../repositories/user.repository.js'
import { User } from '../entities/user.entity.js'
import { RedisClient } from '../../redis/redis.client.js'
import { TokenContent } from '../../auth/middleware/auth.middleware.js'

export interface AuthContent {
  uuid: string
}

@Injectable()
export class UserAuthService {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly redisClient: RedisClient
  ) { }

  async findOneBySubject (token: TokenContent): Promise<AuthContent> {
    const cacheKey = `auth:${token.sub}`

    const cachedUser = await this.redisClient.getCachedValue(cacheKey)

    if (cachedUser != null) {
      return JSON.parse(cachedUser) as AuthContent
    }

    const user = await this.fetchAndCreateUser(token)

    const response: AuthContent = {
      uuid: user.uuid
    }

    await this.redisClient.putCachedValue(cacheKey, JSON.stringify(response))

    return user
  }

  private async fetchAndCreateUser (token: TokenContent): Promise<User> {
    let user = await this.userRepository.findOne({ where: { userId: token.sub } })

    if (user != null) {
      return user
    }

    user = this.userRepository.create({
      userId: token.sub,
      email: token.email
    })

    await this.userRepository.insert(user)

    return user
  }
}
