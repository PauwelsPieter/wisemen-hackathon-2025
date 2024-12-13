import { Injectable } from '@nestjs/common'
import { WiseEvent } from '../../events/wise-event.js'
import { SubscribeToAll } from '../../events/subscribe.decorator.js'
import { PgBossScheduler } from '../../pgboss/scheduler/pgboss-scheduler.service.js'
import { NatsOutboxEventMapper } from './nats-outbox-event.mapper.js'
import { PublishNatsEventJob } from './publish-nats-event/publish-nats-event.job.js'

@Injectable()
export class NatsOutboxSubscriber {
  constructor (
    private readonly mapper: NatsOutboxEventMapper,
    private readonly jobScheduler: PgBossScheduler
  ) {}

  @SubscribeToAll()
  async handleEventFired (event: WiseEvent): Promise<void> {
    if (event.isExternal) {
      const mappedEvent = this.mapper.map(event)

      const job = new PublishNatsEventJob(mappedEvent)

      await this.jobScheduler.scheduleJob(job)
    }
  }
}
