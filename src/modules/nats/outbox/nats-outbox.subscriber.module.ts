import { Module } from '@nestjs/common'
import { PgBossSchedulerModule } from '@wisemen/pgboss-nestjs-job'
import { NatsOutboxEventMapper } from './nats-outbox-event.mapper.js'
import { NatsOutboxSubscriber } from './nats-outbox.subscriber.js'

@Module({
  imports: [PgBossSchedulerModule],
  providers: [
    NatsOutboxSubscriber,
    NatsOutboxEventMapper
  ]
})
export class NatsOutboxSubscriberModule {}
