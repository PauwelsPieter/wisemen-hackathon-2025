import { Module } from '@nestjs/common'
import { NatsModule } from '../../nats.module.js'
import { PublishNatsEventJobHandler } from './publish-nats-event.handler.js'

@Module({
  imports: [NatsModule],
  providers: [PublishNatsEventJobHandler]
})
export class PublishNatsEventJobModule {}
