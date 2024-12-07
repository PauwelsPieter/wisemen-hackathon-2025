import { Module } from '@nestjs/common'
import { NatsModule } from '../../nats.module.js'
import { PublishNatsEventJob } from '../publish-nats-event.job.js'

@Module({
  imports: [
    NatsModule.forRoot()
  ],
  providers: [
    PublishNatsEventJob
  ]
})
export class PublishNatsEventJobModule {}
