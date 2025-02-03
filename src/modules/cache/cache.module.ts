import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { UserRepository } from '../users/repositories/user.repository.js'
import { CacheService } from '../cache/cache.service.js'
import { RedisModule } from '../redis/redis.module.js'
import { Role } from '../roles/entities/role.entity.js'

@Module({
  imports: [
    // NatsModule.forRoot(),
    RedisModule.forRoot(),
    TypeOrmModule.forFeature([Role])
  ],
  controllers: [],
  providers: [
    CacheService,
    UserRepository
  ],
  exports: [
    CacheService
  ]
})
export class CacheModule {}
