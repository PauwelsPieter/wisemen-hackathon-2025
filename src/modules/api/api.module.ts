import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AppModule } from '../../app.module.js'
import { AuthModule } from '../auth/auth.module.js'
import { SwaggerModule } from '../swagger/swagger.module.js'
import { StatusModule } from '../status/status.module.js'
import { UserModule } from '../../app/users/user.module.js'
import { RoleModule } from '../../app/roles/role.module.js'
import { PermissionModule } from '../permission/permission.module.js'
import { FileModule } from '../files/file.module.js'
import { LocalizationModule } from '../localization/modules/localization.module.js'
import { ContactModule } from '../../app/contact/contact.module.js'
import { UiPreferencesModule } from '../../app/ui-preferences/ui-preferences.module.js'
import { AuthMiddleware } from '../auth/middleware/auth.middleware.js'
import { DomainEventLogModule } from '../domain-event-log/domain-event-log.module.js'
import { OneSignalModule } from '../one-signal/one-signal.module.js'
import { GlobalSearchModule } from '../global-search/global-search.module.js'
import { NotificationModule } from '../notification/notification.module.js'
import { JobsApiModule } from '../jobs/jobs.api-module.js'

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
    UiPreferencesModule,
    OneSignalModule,
    DomainEventLogModule,
    GlobalSearchModule,
    NotificationModule,
    JobsApiModule
  ]
})
export class ApiModule {
  configure (consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .exclude('auth/token')
      .forRoutes('{*all}')
  }
}
