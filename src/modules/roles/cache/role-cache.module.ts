import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { RedisModule } from '../../redis/redis.module.js'
import { Role } from '../entities/role.entity.js'
import { RoleCache } from './role-cache.service.js'

@Module({
  imports: [
    RedisModule,
    TypeOrmModule.forFeature([Role])
  ],
  controllers: [],
  providers: [RoleCache],
  exports: [RoleCache]
})
export class RoleCacheModule {}
