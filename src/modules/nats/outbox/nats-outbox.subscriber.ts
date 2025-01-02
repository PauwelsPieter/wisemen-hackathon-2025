import { Injectable } from '@nestjs/common'
import { WiseEvent } from '../../events/wise-event.js'
import { Subscribe } from '../../events/subscribe.decorator.js'
import { PgBossScheduler } from '../../pgboss/scheduler/pgboss-scheduler.service.js'
import { UserRegisteredEvent } from '../../events/example-event.js'
import { NatsOutboxEventMapper } from './nats-outbox-event.mapper.js'
import { PublishNatsEventJob } from './publish-nats-event/publish-nats-event.job.js'

@Injectable()
export class NatsOutboxSubscriber {
  constructor (
    private readonly mapper: NatsOutboxEventMapper,
    private readonly jobScheduler: PgBossScheduler
  ) {}

  @Subscribe(UserRegisteredEvent)
  async handleEventFired (event: WiseEvent): Promise<void> {
    const mappedEvent = this.mapper.map(event)

    const job = new PublishNatsEventJob(mappedEvent)

    await this.jobScheduler.scheduleJob(job)
  }
}
