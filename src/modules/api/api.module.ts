import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AppModule } from '../../app.module.js'
import { AuthModule } from '../auth/auth.module.js'
import { SwaggerModule } from '../swagger/swagger.module.js'
import { StatusModule } from '../status/modules/status.module.js'
import { UserModule } from '../../app/users/user.module.js'
import { RoleModule } from '../../app/roles/role.module.js'
import { PermissionModule } from '../permission/permission.module.js'
import { FileModule } from '../files/modules/file.module.js'
import { LocalizationModule } from '../localization/modules/localization.module.js'
import { ContactModule } from '../../app/contact/contact.module.js'
import { PreferencesModule } from '../../app/preferences/preferences.module.js'
import { AuthMiddleware } from '../auth/middleware/auth.middleware.js'

@Module({
  imports: [
    AppModule.forRoot(),
    AuthModule,
    SwaggerModule,
    StatusModule,
    UserModule,
    RoleModule,
    PermissionModule,
    FileModule,
    LocalizationModule,
    ContactModule,
    PreferencesModule
  ]
})
export class ApiModule {
  configure (consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .exclude('auth/token')
      .forRoutes('*')
  }
}
