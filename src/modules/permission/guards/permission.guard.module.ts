import { Module } from '@nestjs/common'
import { RoleCacheModule } from '../../../app/roles/cache/role-cache.module.js'
import { UserCacheModule } from '../../../app/users/cache/user-cache.module.js'
import { PermissionGuardService } from './permission.guard.service.js'

@Module({
  imports: [
    RoleCacheModule,
    UserCacheModule
  ],
  providers: [PermissionGuardService],
  exports: [PermissionGuardService]
})
export class PermissionsGuardModule {}
