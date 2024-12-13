import { DynamicModule, Type, MiddlewareConsumer, Module } from '@nestjs/common'
import { SentryModule } from '@sentry/nestjs/setup'
import { AuthModule } from '../../src/modules/auth/auth.module.js'
import { AuthMiddleware } from '../../src/modules/auth/middleware/auth.middleware.js'
import { DefaultConfigModule } from '../../src/modules/config/default-config.module.js'
import { EventModule } from '../../src/modules/events/event.module.js'
import { ExceptionModule } from '../../src/modules/exceptions/exception.module.js'
import { NatsModule } from '../../src/modules/nats/nats.module.js'
import { RoleModule } from '../../src/modules/roles/role.module.js'
import { DefaultTypeOrmModule } from '../../src/modules/typeorm/default-typeorm.module.js'
import { UserModule } from '../../src/modules/users/user.module.js'
import { ValidationModule } from '../../src/modules/validation/validation.module.js'

@Module({})
export class TestModule {
  static forRoot (
    modules: Array<DynamicModule | Type<unknown>> = []
  ): DynamicModule {
    return {
      module: TestModule,
      imports: [
        SentryModule.forRoot(),
        DefaultConfigModule.forRoot(),
        DefaultTypeOrmModule.forRootAsync({ migrationsRun: false }),

        ExceptionModule,
        ValidationModule,

        NatsModule.forRoot(),
        EventModule.forRoot(),

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
