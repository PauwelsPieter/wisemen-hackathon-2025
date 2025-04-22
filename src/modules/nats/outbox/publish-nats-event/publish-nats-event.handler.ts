import { Injectable } from '@nestjs/common'
import { JobHandler, PgBossJobHandler } from '@wisemen/pgboss-nestjs-job'
import { NatsClient } from '../../nats.client.js'
import { NatsOutboxEvent, PublishNatsEventJob } from './publish-nats-event.job.js'

@Injectable()
@PgBossJobHandler(PublishNatsEventJob)
export class PublishNatsEventJobHandler extends JobHandler<PublishNatsEventJob> {
  constructor (
    private readonly natsClient: NatsClient
  ) {
    super()
  }

  public run (event: NatsOutboxEvent): void {
    this.natsClient.publish(event.topic, event.serializedMessage)
  }
}
