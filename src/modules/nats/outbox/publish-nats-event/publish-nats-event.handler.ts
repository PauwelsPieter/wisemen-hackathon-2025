import { StringCodec } from 'nats'
import { Injectable } from '@nestjs/common'
import { NatsClient } from '../../nats.client.js'
import { BaseJobHandler } from '../../../pgboss/jobs/job.abstract.js'
import { PgBossJobHandler } from '../../../pgboss/jobs/job.decorator.js'
import type { NatsOutboxEvent } from '../nats-outbox-event.js'
import { PublishNatsEventJob } from './publish-nats-event.job.js'

@Injectable()
@PgBossJobHandler(PublishNatsEventJob)
export class PublishNatsEventJobHandler extends BaseJobHandler<NatsOutboxEvent> {
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
