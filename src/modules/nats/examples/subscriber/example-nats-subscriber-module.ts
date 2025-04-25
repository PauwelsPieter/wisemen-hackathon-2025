import { Module } from '@nestjs/common'
import { ExampleNatsSubscriber } from './example-nats-subscriber.js'

@Module({
  providers: [ExampleNatsSubscriber]
})
export class ExampleNatsSubscriberModule {}
