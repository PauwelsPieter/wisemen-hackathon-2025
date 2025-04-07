import { StringCodec } from 'nats'
import { Injectable } from '@nestjs/common'
import { JobHandler, PgBossJobHandler } from '@wisemen/pgboss-nestjs-job'
import { NatsClient } from '../../nats.client.js'
import { NatsOutboxEvent, PublishNatsEventJob } from './publish-nats-event.job.js'

@Injectable()
@PgBossJobHandler(PublishNatsEventJob)
export class PublishNatsEventJobHandler extends JobHandler<PublishNatsEventJob> {
  private readonly encoder = StringCodec()
  constructor (
    private readonly natsClient: NatsClient
  ) {
    super()
  }

  public run (event: NatsOutboxEvent): void {
    const encodedMessage = this.encoder.encode(event.serializedMessage)
    this.natsClient.publish(event.topic, encodedMessage)
  }
}
