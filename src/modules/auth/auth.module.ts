import { Global, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { PermissionModule } from '../permission/permission.module.js'
import { PermissionsGuard } from '../permission/permission.guard.js'
import { AuthGuard } from './guards/auth.guard.js'
import { AuthStorage } from './auth.storage.js'

@Global()
@Module({
  imports: [
    PermissionModule
  ],
  providers: [
    AuthStorage,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard
    }
  ],
  exports: [
    AuthStorage
  ]
})

export class AuthModule {}
