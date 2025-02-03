import { Module } from '@nestjs/common'
import { NatsModule } from '../../nats.module.js'
import { PublishNatsEventJobHandler } from './publish-nats-event.handler.js'

@Module({
  imports: [
    NatsModule.forRoot()
  ],
  providers: [
    PublishNatsEventJobHandler
  ]
})
export class PublishNatsEventJobModule {}
