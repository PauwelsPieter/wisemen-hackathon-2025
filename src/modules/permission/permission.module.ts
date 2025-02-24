import { Module } from '@nestjs/common'
import { RoleCacheModule } from '../../app/roles/cache/role-cache.module.js'
import { UserCacheModule } from '../../app/users/cache/user-cache.module.js'
import { PermissionController } from './controllers/permission.controller.js'
import { PermissionService } from './permission.service.js'

@Module({
  imports: [
    RoleCacheModule,
    UserCacheModule
  ],
  controllers: [
    PermissionController
  ],
  providers: [
    PermissionService
  ],
  exports: [
    PermissionService
  ]
})
export class PermissionModule {}
