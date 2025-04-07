import { Module } from '@nestjs/common'
import { NatsClient } from './nats.client.js'

@Module({
  providers: [NatsClient],
  exports: [NatsClient]
})
export class NatsModule {}
