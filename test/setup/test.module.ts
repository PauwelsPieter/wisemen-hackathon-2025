import { DynamicModule, Type, MiddlewareConsumer, Module } from '@nestjs/common'
import { SentryModule } from '@sentry/nestjs/setup'
import { AuthModule } from '../../src/modules/auth/auth.module.js'
import { AuthMiddleware } from '../../src/modules/auth/middleware/auth.middleware.js'
import { DefaultConfigModule } from '../../src/modules/config/default-config.module.js'
import { EventModule } from '../../src/modules/events/event.module.js'
import { ExceptionModule } from '../../src/modules/exceptions/exception.module.js'
import { NatsModule } from '../../src/modules/nats/nats.module.js'
import { RoleModule } from '../../src/app/roles/role.module.js'
import { DefaultTypeOrmModule } from '../../src/modules/typeorm/default-typeorm.module.js'
import { UserModule } from '../../src/app/users/user.module.js'

@Module({})
export class TestModule {
  static forRoot (
    modules: Array<DynamicModule | Type<unknown>> = [],
    migrationsRun = false
  ): DynamicModule {
    return {
      module: TestModule,
      imports: [
        SentryModule.forRoot(),
        DefaultConfigModule,
        DefaultTypeOrmModule.forRootAsync({ migrationsRun }),

        ExceptionModule,

        NatsModule,
        EventModule,

        AuthModule,
        UserModule,
        RoleModule,

        // Utils
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
