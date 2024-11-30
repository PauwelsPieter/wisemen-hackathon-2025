import { Global, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { CacheModule } from '../cache/cache.module.js'
import { PermissionsGuard } from '../permission/permission.guard.js'
import { AuthGuard } from './guards/auth.guard.js'
import { AuthStorage } from './auth.storage.js'

@Global()
@Module({
  imports: [
    CacheModule
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
