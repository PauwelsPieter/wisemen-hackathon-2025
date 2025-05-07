import { nkeyAuthenticator } from '@nats-io/transport-node'
import { NatsClient } from '../../clients/nats-client.decorator.js'

@NatsClient(configService => ({
  name: 'example-client',
  servers: [`${configService.getOrThrow('NATS_HOST')}:${configService.getOrThrow('NATS_PORT')}`],
  authenticator: nkeyAuthenticator(new TextEncoder().encode(process.env.EXAMPLE_NATS_NKEY ?? ''))
}))
export class ExampleNatsClient {}
