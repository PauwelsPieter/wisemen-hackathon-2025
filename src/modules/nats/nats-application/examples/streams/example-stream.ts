import { NatsStream } from '../../streams/nats-stream.decorator.js'
import { ExampleNatsClient } from '../consumer/example-nats-client.js'

@NatsStream(() => ({
  name: 'example_stream',
  subjects: ['example.stream.>'],
  client: ExampleNatsClient
}))
export class ExampleStream {}
