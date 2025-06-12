import { Logger } from '@nestjs/common'
import { IsNotEmpty, IsString } from 'class-validator'
import { NatsSubscriber } from '../../subscribers/nats-subscriber.decorator.js'
import { WebappNatsClient } from '../../../../../app/webapp-auth-callout/webapp.nats-client.js'
import { OnNatsMessage } from '../../message-handler/on-nats-message.decorator.js'
import { NatsMessageData } from '../../parameters/nats-message-data.decorator.js'
import { NatsMsgDataValidationPipe } from '../../parameters/pipes/nats-message-data-validation.pipe.js'
import { NatsMessageSubject } from '../../parameters/nats-message-subject.decorator.js'
import { NatsMsgDataJsonPipe } from '../../parameters/pipes/nats-message-data-json.pipe.js'
import { NatsCloudEventData } from '../../parameters/nats-cloud-event-data.decorator.js'
import { OnNatsCloudEvent } from '../../message-handler/on-nats-cloud-event.decorator.js'
import { natsSubject } from '../../nats-subject.js'

const EXAMPLE_SUBJECT = '{env}.example.>'

class ExampleIncomingEvent {
  @IsString()
  @IsNotEmpty()
  name: string
}

@NatsSubscriber(configService => ({
  client: WebappNatsClient,
  subject: natsSubject(EXAMPLE_SUBJECT, {
    env: configService.getOrThrow<string>('NODE_ENV')
  })
}))
export class ExampleNatsSubscriber {
  @OnNatsCloudEvent({ type: 'example.created', version: '1.0' })
  onExampleCreated (
    @NatsCloudEventData() event: ExampleIncomingEvent
  ): void {
    Logger.log(`Example ${event.name} created`)
  }

  @OnNatsCloudEvent({ type: 'example.created', version: '1.1' })
  onExampleCreatedV1_1Event (
    @NatsCloudEventData() event: ExampleIncomingEvent
  ): void {
    Logger.log(`Example ${event.name} created in v1.1`)
  }

  @OnNatsCloudEvent({ type: 'example.updated', version: '1.0' })
  onExampleUpdated (
    @NatsCloudEventData() event: ExampleIncomingEvent
  ): void {
    Logger.log(`Example ${event.name} updated`)
  }

  @OnNatsMessage()
  onFallback (
    @NatsMessageData(
      NatsMsgDataJsonPipe,
      NatsMsgDataValidationPipe
    ) data: ExampleIncomingEvent,
    @NatsMessageSubject() subject: string
  ): void {
    Logger.log(`Received on ${subject} message ${JSON.stringify(data)}`)
  }
}
