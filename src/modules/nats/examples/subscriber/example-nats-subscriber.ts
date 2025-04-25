import { Msg } from '@nats-io/transport-node'
import { Logger } from '@nestjs/common'
import { NatsSubscriber } from '../../nats-subscriber.decorator.js'
import { WebappNatsClient } from '../../../../app/webapp-auth-callout/webapp.nats-client.js'
import { OnNatsMessage } from '../../on-nats-event.decorator.js'

@NatsSubscriber({
  subject: 'test.>',
  client: WebappNatsClient
})
export class ExampleNatsSubscriber {
  @OnNatsMessage()
  on (message: Msg): void {
    Logger.log(`Received message ${new TextDecoder().decode(message.data)}`)
  }
}
