import { SECONDS_PER_MINUTE } from '@wisemen/time'
import { BaseJob, BaseJobData, PgBossJob } from '@wisemen/pgboss-nestjs-job'
import { QueueName } from '../../../pgboss/enums/queue-name.enum.js'

export interface NatsOutboxEvent extends BaseJobData {
  subject: string
  serializedMessage: string
}

@PgBossJob(QueueName.SYSTEM)
export class PublishNatsEventJob extends BaseJob<NatsOutboxEvent> {
  constructor (data: NatsOutboxEvent) {
    super(data, {
      priority: 0,
      retryLimit: 3,
      retryBackoff: false,
      expireInSeconds: 5 * SECONDS_PER_MINUTE
    })
  }
}
