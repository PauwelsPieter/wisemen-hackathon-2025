import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { CacheModule } from '../cache/cache.module.js'
import { PermissionsGuard } from '../permissions/permissions.guard.js'
import { AuthGuard } from './guards/auth.guard.js'

@Module({
  imports: [
    CacheModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard
    }
  ]
})

export class AuthModule {}
