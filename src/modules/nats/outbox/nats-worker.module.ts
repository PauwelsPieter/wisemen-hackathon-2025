import { type DynamicModule, Module } from '@nestjs/common'
import { NatsClient } from '../nats.client.js'

@Module({})
export class NatsWorkerModule {
  static forRoot (
    modules: DynamicModule[]
  ): DynamicModule {
    return {
      module: NatsWorkerModule,
      imports: [...modules],
      providers: [
        NatsClient
      ]
    }
  }
}
