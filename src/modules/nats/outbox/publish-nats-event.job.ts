import { ModuleRef } from '@nestjs/core'
import { StringCodec } from 'nats'
import { SECONDS_PER_MINUTE } from '@appwise/time'
import { PgBossJob } from '../../pgboss/jobs/pgboss.job.js'
import { NatsClient } from '../nats.client.js'
import { QueueName } from '../../pgboss/queue-name.enum.js'
import { NatsOutboxEvent } from './nats-outbox-event.js'

export class PublishNatsEventJob extends PgBossJob {
  protected queueName = QueueName.NATS
  protected readonly onCompleteJob: boolean = false
  protected readonly priority = 0
  protected readonly retryLimit = 3
  protected readonly retryBackoff = false
  protected readonly retryDelayInSeconds = 10
  protected readonly expireInSeconds = 5 * SECONDS_PER_MINUTE
  protected readonly startAfterInSeconds = 0

  constructor (
    private readonly event: NatsOutboxEvent
  ) {
    super()
  }

  run (moduleRef: ModuleRef): void {
    const natsClient = moduleRef.get(NatsClient, { strict: false })
    const encoder = StringCodec()

    natsClient.publish(this.event.topic, encoder.encode(this.event.serializedMessage))
  }
}
