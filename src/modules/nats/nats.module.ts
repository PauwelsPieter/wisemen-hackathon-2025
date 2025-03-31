import { Module } from '@nestjs/common'
import { NatsClient } from './nats.client.js'
import { ExamplePublisher } from './publishers/example.publisher.js'

@Module({
  imports: [],
  providers: [
    NatsClient,
    ExamplePublisher
  ],
  exports: [
    NatsClient
  ]
})
export class NatsModule {}
