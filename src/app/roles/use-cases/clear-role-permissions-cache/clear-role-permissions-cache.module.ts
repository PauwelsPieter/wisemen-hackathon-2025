import { Module } from '@nestjs/common'
import { RoleCacheModule } from '../../cache/role-cache.module.js'
import { ClearRolePermissionsCacheSubscriber } from './clear-role-permissions-cache.subscriber.js'

@Module({
  imports: [RoleCacheModule],
  providers: [ClearRolePermissionsCacheSubscriber]
})
export class ClearRolePermissionsCacheModule {}
