import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { RedisModule } from '../../../modules/redis/redis.module.js'
import { User } from '../entities/user.entity.js'
import { UserCache } from './user-cache.js'

@Module({
  imports: [
    RedisModule,
    TypeOrmModule.forFeature([User])
  ],
  controllers: [],
  providers: [UserCache],
  exports: [UserCache]
})
export class UserCacheModule {}
