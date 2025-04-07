import { Module } from '@nestjs/common'
import { PgBossSchedulerModule } from '@wisemen/pgboss-nestjs-job'
import { NatsPublisher } from './nats-publisher.js'

@Module({
  imports: [PgBossSchedulerModule],
  providers: [NatsPublisher],
  exports: [NatsPublisher]
})
export class NatsPublisherModule {}
