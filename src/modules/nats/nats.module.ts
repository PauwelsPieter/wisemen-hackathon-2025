import { Module } from '@nestjs/common'
import { PgBossSchedulerModule } from '@wisemen/pgboss-nestjs-job'
import { NatsClient } from './nats.client.js'
import { NatsOutboxSubscriber } from './outbox/nats-outbox.subscriber.js'
import { ExamplePublisher } from './publishers/example.publisher.js'
import { NatsOutboxEventMapper } from './outbox/nats-outbox-event.mapper.js'

@Module({
  imports: [
    PgBossSchedulerModule
  ],
  providers: [
    NatsClient,
    ExamplePublisher,
    NatsOutboxSubscriber,
    NatsOutboxEventMapper
  ],
  exports: [
    NatsClient
  ]
})
export class NatsModule {}
