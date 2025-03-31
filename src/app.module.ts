import { DynamicModule, Module, Type } from '@nestjs/common'
import { SentryModule } from '@sentry/nestjs/setup'
import { ExceptionModule } from './modules/exceptions/exception.module.js'
import { DefaultTypeOrmModule } from './modules/typeorm/default-typeorm.module.js'
import { DefaultConfigModule } from './modules/config/default-config.module.js'
import { GlobalPipesModule } from './modules/global-pipes/global-pipes.module.js'
import { EventSubscribersModule } from './modules/events/event-subscribers.module.js'

@Module({})
export class AppModule {
  static forRoot (
    modules: Array<DynamicModule | Promise<DynamicModule> | Type<unknown>> = []
  ): DynamicModule {
    return {
      module: AppModule,
      imports: [
        SentryModule.forRoot(),
        DefaultConfigModule,
        DefaultTypeOrmModule.forRootAsync({ migrationsRun: true }),

        ExceptionModule,
        GlobalPipesModule,

        EventSubscribersModule,

        // Utils
        ...modules
      ]
    }
  }
}
