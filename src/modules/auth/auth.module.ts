import { Global, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { PermissionModule } from '../permission/permission.module.js'
import { PermissionsGuard } from '../permission/permission.guard.js'
import { UserModule } from '../../app/users/user.module.js'
import { AuthGuard } from './guards/auth.guard.js'
import { AuthContext } from './auth.context.js'
import { AuthMiddleware } from './middleware/auth.middleware.js'

@Global()
@Module({
  imports: [
    UserModule,
    PermissionModule
  ],
  providers: [
    AuthContext,
    AuthMiddleware,
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
    AuthContext
  ]
})

export class AuthModule {}
