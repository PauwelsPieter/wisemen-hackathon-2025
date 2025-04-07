import { Injectable } from '@nestjs/common'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { DomainEvent } from '../../domain-events/domain-event.js'
import { NatsOutboxEventMapper } from './nats-outbox-event.mapper.js'
import { PublishNatsEventJob } from './publish-nats-event/publish-nats-event.job.js'

@Injectable()
export class NatsOutboxSubscriber {
  constructor (
    private readonly mapper: NatsOutboxEventMapper,
    private readonly jobScheduler: PgBossScheduler
  ) {}

  async handleEventFired (event: DomainEvent): Promise<void> {
    const mappedEvent = this.mapper.map(event)

    const job = new PublishNatsEventJob(mappedEvent)

    await this.jobScheduler.scheduleJob(job)
  }
}
