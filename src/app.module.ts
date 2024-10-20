import { type DynamicModule, type MiddlewareConsumer, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from './modules/auth/auth.module.js'
import { UserModule } from './modules/users/user.module.js'
import { TypesenseModule } from './modules/typesense/modules/typesense.module.js'
import { MailModule } from './modules/mail/modules/mail.module.js'
import { RoleModule } from './modules/roles/role.module.js'
import { PermissionModule } from './modules/permissions/permissions.module.js'
import configuration from './config/env/configuration.js'
import { StatusModule } from './modules/status/modules/status.module.js'
import { FileModule } from './modules/files/modules/file.module.js'
import { PgBossModule } from './modules/pgboss/pgboss.module.js'
import { envValidationSchema } from './config/env/env.validation.js'
import { NatsModule } from './modules/nats/nats.module.js'
import { CacheModule } from './modules/cache/cache.module.js'
import { RedisModule } from './modules/redis/redis.module.js'
import { AuthMiddleware } from './modules/auth/middleware/auth.middleware.js'
import { mainMigrations } from './config/sql/migrations/index.js'
import { sslHelper } from './config/sql/utils/typeorm.js'
import { LocalizationModule } from './modules/localization/modules/localization.module.js'
import { ValidationModule } from './modules/validation/validation.module.js'
import { ExceptionModule } from './modules/exceptions/exception.module.js'

@Module({})
export class AppModule {
  static forRoot (
    modules: DynamicModule[] = []
  ): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: process.env.ENV_FILE,
          load: [configuration],
          validationSchema: envValidationSchema,
          isGlobal: true
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
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
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env.DATABASE_URI,
          ssl: sslHelper(process.env.DATABASE_SSL),
          extra: { max: 50 },
          logging: false,
          synchronize: false,
          migrations: mainMigrations,
          migrationsRun: true,
          autoLoadEntities: true
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

        ...modules
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
