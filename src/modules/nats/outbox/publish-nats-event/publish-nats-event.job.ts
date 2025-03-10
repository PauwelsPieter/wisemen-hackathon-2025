import { SECONDS_PER_MINUTE } from '@wisemen/time'
import { BaseJob, PgBossJob } from '@wisemen/pgboss-nestjs-job'
import type { NatsOutboxEvent } from '../nats-outbox-event.js'
import { QueueName } from '../../../pgboss/enums/queue-name.enum.js'

@PgBossJob(QueueName.SYSTEM)
export class PublishNatsEventJob extends BaseJob<NatsOutboxEvent> {
  constructor (
    data: NatsOutboxEvent
  ) {
    super(data, {
      priority: 0,
      retryLimit: 3,
      retryBackoff: false,
      expireInSeconds: 5 * SECONDS_PER_MINUTE
    })
  }
}
