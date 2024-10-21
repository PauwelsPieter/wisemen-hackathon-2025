import { type DynamicModule, Module, type Provider } from '@nestjs/common'
import { PgBossModule } from '../pgboss/pgboss.module.js'
import { NatsClient } from './nats.client.js'
import { NatsOutboxSubscriber } from './outbox/nats-outbox.subscriber.js'
import { ExamplePublisher } from './publishers/example.publisher.js'
import { NatsOutboxEventMapper } from './outbox/nats-outbox-event.mapper.js'
import { PublishNatsEventJob } from './outbox/publish-nats-event.job.js'

@Module({})
export class NatsModule {
  static forRoot (providers: Provider[] = []): DynamicModule {
    return {
      module: NatsModule,
      imports: [
        PgBossModule.forFeature([PublishNatsEventJob])
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
