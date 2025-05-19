import { Module } from '@nestjs/common'
import { ViewPermissionIndexModule } from './use-cases/view-permission-index/view-permission-index.module.js'
import { PermissionsGuardModule } from './guards/permission.guard.module.js'

@Module({
  imports: [
    ViewPermissionIndexModule,
    PermissionsGuardModule
  ],
  exports: [PermissionsGuardModule]
})
export class PermissionModule {}
