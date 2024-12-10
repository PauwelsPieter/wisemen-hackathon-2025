import { type DynamicModule, Module } from '@nestjs/common'
import { NatsClient } from '../nats.client.js'
import { DefaultTypeOrmModule } from '../../typeorm/default-typeorm.module.js'
import { DefaultConfigModule } from '../../config/default-config.module.js'

@Module({})
export class NatsWorkerModule {
  static forRoot (
    modules: DynamicModule[]
  ): DynamicModule {
    return {
      module: NatsWorkerModule,
      imports: [
        DefaultTypeOrmModule.forRootAsync(),
        DefaultConfigModule.forRoot(),
        ...modules
      ],
      providers: [
        NatsClient
      ]
    }
  }
}
