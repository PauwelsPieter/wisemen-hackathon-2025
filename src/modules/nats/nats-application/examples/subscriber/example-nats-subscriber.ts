import { Logger } from '@nestjs/common'
import { IsNotEmpty, IsString } from 'class-validator'
import { NatsSubscriber } from '../../subscribers/nats-subscriber.decorator.js'
import { WebappNatsClient } from '../../../../../app/webapp-auth-callout/webapp.nats-client.js'
import { OnNatsMessage } from '../../message-handler/on-nats-message.decorator.js'
import { NatsMessageData } from '../../parameters/nats-message-data.decorator.js'
import { NatsMsgDataValidationPipe } from '../../parameters/pipes/nats-message-data-validation.pipe.js'
import { NatsMessageSubject } from '../../parameters/nats-message-subject.decorator.js'
import { NatsMsgDataJsonPipe } from '../../parameters/pipes/nats-message-data-json.pipe.js'

class ExampleIncomingEvent {
  @IsString()
  @IsNotEmpty()
  name: string
}

@NatsSubscriber({
  subject: 'test.>',
  client: WebappNatsClient
})
export class ExampleNatsSubscriber {
  @OnNatsMessage()
  on (
    @NatsMessageData(
      NatsMsgDataJsonPipe,
      NatsMsgDataValidationPipe
    ) data: ExampleIncomingEvent,
    @NatsMessageSubject() subject: string
  ): void {
    Logger.log(`Received on ${subject} message ${JSON.stringify(data)}`)
  }
}
