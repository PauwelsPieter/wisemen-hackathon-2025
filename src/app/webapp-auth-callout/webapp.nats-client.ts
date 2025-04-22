import { nkeyAuthenticator } from '@nats-io/transport-node'
import { NatsClient } from '../../modules/nats/nats-client.decorator.js'

@NatsClient(configService => ({
  name: 'webapp-authenticator-client',
  servers: [`${configService.getOrThrow('NATS_HOST')}:${configService.getOrThrow('NATS_PORT')}`],
  authenticator: nkeyAuthenticator(new TextEncoder().encode(process.env.WEBAPP_NKEY ?? ''))
}))
export class WebappNatsClient {}
