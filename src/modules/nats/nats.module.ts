import { type DynamicModule, Module, type Provider } from '@nestjs/common'
import { PgBossSchedulerModule } from '../pgboss/scheduler/pgboss-scheduler.module.js'
import { NatsClient } from './nats.client.js'
import { NatsOutboxSubscriber } from './outbox/nats-outbox.subscriber.js'
import { ExamplePublisher } from './publishers/example.publisher.js'
import { NatsOutboxEventMapper } from './outbox/nats-outbox-event.mapper.js'

@Module({})
export class NatsModule {
  static forRoot (providers: Provider[] = []): DynamicModule {
    return {
      module: NatsModule,
      imports: [
        PgBossSchedulerModule
      ],
      providers: [
        NatsClient,
        ExamplePublisher,
        NatsOutboxSubscriber,
        NatsOutboxEventMapper,
        ...providers
      ],
      exports: [
        NatsClient
      ]
    }
  }
}
