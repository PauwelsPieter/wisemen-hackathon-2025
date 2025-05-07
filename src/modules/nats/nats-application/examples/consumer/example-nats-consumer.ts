import { Logger } from '@nestjs/common'
import { JsMsg } from '@nats-io/jetstream'
import { NatsConsumer } from '../../consumers/nats-consumer.decorator.js'
import { OnJetstreamMessage } from '../../consumers/on-jetstream-message.decorator.js'
import { ExampleNatsClient } from './example-nats-client.js'

@NatsConsumer({
  streamName: 'example_stream',
  client: ExampleNatsClient,
  durable_name: 'test_consumer',
  ack_policy: 'explicit',
  deliver_policy: 'new',
  replay_policy: 'instant'
})
export class ExampleNatsConsumer {
  @OnJetstreamMessage()
  on (message: JsMsg): void {
    Logger.log(`Received message ${new TextDecoder().decode(message.data)}`)
  }
}
