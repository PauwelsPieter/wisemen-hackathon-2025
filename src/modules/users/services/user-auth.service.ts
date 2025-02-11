import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { UserRole } from '../../../modules/roles/entities/user-role.entity.js'
import { Role } from '../../../modules/roles/entities/role.entity.js'
import { User } from '../entities/user.entity.js'
import { RedisClient } from '../../redis/redis.client.js'
import { TokenContent } from '../../auth/middleware/auth.middleware.js'
import { TypesenseCollectionName } from '../../typesense/enums/typesense-collection-index.enum.js'
import { TypesenseCollectionService } from '../../typesense/services/typesense-collection.service.js'
import { AuthContent } from '../../auth/auth.storage.js'

@Injectable()
export class UserAuthService {
  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly redisClient: RedisClient,
    private readonly typesenseService: TypesenseCollectionService
  ) { }

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
    let user = await this.userRepository.findOne({ where: { userId: token.sub } })

    if (user != null) {
      return user
    }

    user = this.userRepository.create({
      userId: token.sub,
      email: token.email
    })

    await this.userRepository.insert(user)

    const defaultRole = await this.roleRepository.findOneByOrFail({
      isDefault: true
    })

    await this.userRoleRepository.insert({
      userUuid: user.uuid,
      roleUuid: defaultRole.uuid
    })

    await this.typesenseService.importManually(TypesenseCollectionName.USER, [user])

    return user
  }
}
