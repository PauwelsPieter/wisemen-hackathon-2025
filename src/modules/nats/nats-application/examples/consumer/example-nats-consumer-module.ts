import { Module } from '@nestjs/common'
import { ExampleNatsConsumer } from './example-nats-consumer.js'

@Module({
  providers: [ExampleNatsConsumer]
})
export class ExampleNatsConsumerModule {}
