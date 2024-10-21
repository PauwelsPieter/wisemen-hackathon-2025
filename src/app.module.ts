import { type DynamicModule, type MiddlewareConsumer, Module } from '@nestjs/common'
import { AuthModule } from './modules/auth/modules/auth.module.js'
import { UserModule } from './modules/users/user.module.js'
import { TypesenseModule } from './modules/typesense/modules/typesense.module.js'
import { MailModule } from './modules/mail/modules/mail.module.js'
import { RoleModule } from './modules/roles/role.module.js'
import { PermissionModule } from './modules/permissions/permissions.module.js'
import { StatusModule } from './modules/status/modules/status.module.js'
import { FileModule } from './modules/files/modules/file.module.js'
import { PgBossModule } from './modules/pgboss/pgboss.module.js'
import { NatsModule } from './modules/nats/nats.module.js'
import { CacheModule } from './modules/cache/cache.module.js'
import { RedisModule } from './modules/redis/redis.module.js'
import { AuthMiddleware } from './modules/auth/middleware/auth.middleware.js'
import { LocalizationModule } from './modules/localization/modules/localization.module.js'
import { ValidationModule } from './modules/validation/validation.module.js'
import { ExceptionModule } from './modules/exceptions/exception.module.js'
import { EventModule } from './modules/events/event.module.js'
import { DefaultTypeormModule } from './modules/typeorm/default-typeorm.module.js'
import { DefaultConfigModule } from './modules/config/default-config.module.js'

@Module({})
export class AppModule {
  static forRoot (
    modules: DynamicModule[] = [],
    forTest: boolean = false
  ): DynamicModule {
    const testDisabledModules = forTest ? [] : [EventModule.forRoot()]

    return {
      module: AppModule,
      imports: [
        DefaultConfigModule.forRoot(),
        DefaultTypeormModule.forRoot(),
        ExceptionModule,
        ValidationModule,

        // Auth
        AuthModule,
        UserModule,
        RoleModule,
        PermissionModule,

        // PG Boss
        PgBossModule.forRoot(),

        // Utils
        MailModule,
        // NatsModule.forRoot(),
        RedisModule.forRoot(),
        TypesenseModule,
        FileModule,
        StatusModule,
        NatsModule.forRoot(),
        LocalizationModule,
        CacheModule,

        ...modules,
        ...testDisabledModules
      ]
    }
  }

  configure (consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .exclude('auth/token')
      .forRoutes('*')
  }
}
