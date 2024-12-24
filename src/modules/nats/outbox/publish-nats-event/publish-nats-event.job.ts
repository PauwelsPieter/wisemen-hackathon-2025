import { SECONDS_PER_MINUTE } from '@wisemen/time'
import { BaseJobConfig } from '../../../pgboss/jobs/job.abstract.js'
import type { NatsOutboxEvent } from '../nats-outbox-event.js'
import { PgBossJob } from '../../../pgboss/jobs/job.decorator.js'
import { QueueName } from '../../../pgboss/queue-name.enum.js'

@PgBossJob(QueueName.NATS)
export class PublishNatsEventJob extends BaseJobConfig<NatsOutboxEvent> {
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
