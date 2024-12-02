import { type DynamicModule, type MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { SentryModule } from '@sentry/nestjs/setup'
import { AuthModule } from './modules/auth/auth.module.js'
import { UserModule } from './modules/users/user.module.js'
import { TypesenseModule } from './modules/typesense/modules/typesense.module.js'
import { MailModule } from './modules/mail/modules/mail.module.js'
import { RoleModule } from './modules/roles/role.module.js'
import { PermissionModule } from './modules/permission/permission.module.js'
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
import { DefaultTypeOrmModule } from './modules/typeorm/default-typeorm.module.js'
import { DefaultConfigModule } from './modules/config/default-config.module.js'
import { ContactModule } from './modules/contact/contact.module.js'

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
        SentryModule.forRoot(),
        DefaultConfigModule.forRoot(),
        DefaultTypeOrmModule.forRootAsync(),
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              privateKey: {
                key: Buffer.from(configService.getOrThrow<string>('RSA_PRIVATE'), 'base64'),
                passphrase: configService.getOrThrow('RSA_PASSPHRASE')
              },
              publicKey: Buffer.from(configService.getOrThrow<string>('RSA_PUBLIC'), 'base64'),
              global: true,
              signOptions: {
                algorithm: 'RS256'
              }
            }
          },
          global: true
        }),
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

        ContactModule,

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
