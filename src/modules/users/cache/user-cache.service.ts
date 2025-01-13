import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { RedisClient } from '../../redis/redis.client.js'
import { User } from '../entities/user.entity.js'

const userRoleCache = `user-role-cache`

@Injectable()
export class UserCache {
  constructor (
    private readonly client: RedisClient,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async setUserRoles (userUuid: string, roleUuids: string[]): Promise<void> {
    await this.client.putCachedValue(`${userRoleCache}.${userUuid}`, JSON.stringify(roleUuids))
  }

  async getUserRoles (userUuid: string): Promise<string[]> {
    const result = await this.client.getCachedValue(`${userRoleCache}.${userUuid}`)

    if (result != null) {
      return JSON.parse(String(result)) as string[]
    }

    const user = await this.userRepository.findOne({
      where: { uuid: userUuid },
      relations: { userRoles: true }
    })

    const roleUuids = user?.userRoles?.map(userRole => userRole.roleUuid) ?? []

    await this.client.putCachedValue(`${userRoleCache}.${userUuid}`, JSON.stringify(roleUuids))

    return roleUuids
  }
}
