import { StringCodec } from 'nats'
import { Injectable } from '@nestjs/common'
import { BaseJobHandler, PgBossJobHandler } from '@wisemen/pgboss-nestjs-job'
import { NatsClient } from '../../nats.client.js'

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
