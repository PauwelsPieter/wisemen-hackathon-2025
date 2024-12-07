import { StringCodec } from 'nats'
import { Injectable } from '@nestjs/common'
import { NatsClient } from '../nats.client.js'
import { BaseJobHandler } from '../../pgboss/jobs/job.abstract.js'
import { QueueName } from '../../pgboss/queue-name.enum.js'
import { PgBossJob } from '../../pgboss/jobs/job.decorator.js'
import { NatsOutboxEvent } from './nats-outbox-event.js'

@Injectable()
@PgBossJob(QueueName.NATS)
export class PublishNatsEventJob extends BaseJobHandler<NatsOutboxEvent> {
  constructor (
    private readonly natsClient: NatsClient
  ) {
    super()
  }

  public run (event: NatsOutboxEvent): void {
    const encoder = StringCodec()

    this.natsClient.publish(
      event.topic,
      encoder.encode(event.serializedMessage)
    )
  }
}
