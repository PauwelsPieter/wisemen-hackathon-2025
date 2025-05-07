import { Consumer, ConsumerInfo, JsMsg } from '@nats-io/jetstream'
import { Logger } from '@nestjs/common'
import { captureException } from '@sentry/nestjs'

export type JetstreamMessageHandlerFunction = (msg: JsMsg) => Promise<void>

export class NatsConsumption {
  private fallbackHandler: JetstreamMessageHandlerFunction | undefined
  constructor (
    private readonly consumerInfo: ConsumerInfo,
    private readonly consumer: Consumer
  ) {}

  addFallBackHandler (handler: JetstreamMessageHandlerFunction): void {
    if (this.fallbackHandler !== undefined) {
      throw new Error(`Fallback handler already set for consumer ${this.consumerInfo.name}`
        + `\nDid you add two @OnNatsMessage() handlers to one @NatsConsumer({...})?`)
    }

    Logger.log('Registered fallback message handler on '
      + `consumer ${this.consumerInfo.name}`, 'NATS')

    this.fallbackHandler = handler
  }

  async listen (): Promise<void> {
    const messages = await this.consumer.consume()
    for await (const message of messages) {
      // Handle  messages 1 by 1 for now
      await this.handleMessage(message)
    }
  }

  private async handleMessage (message: JsMsg): Promise<void> {
    try {
      const handler = this.getHandler(message)
      await handler(message)
      message.ack()
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'unknown cause'
      Logger.error(`Nats message handler threw error ${errorMessage}`, `NATS consumer ${this.consumerInfo.name}`)
      captureException(e)
      message.nak()
    }
  }

  private getHandler (_forMessage: JsMsg): JetstreamMessageHandlerFunction {
    if (this.fallbackHandler === undefined) {
      throw new Error(`No handler found for message`
        + `on NATS consumer ${this.consumerInfo.name}.`
        + '\nDid you forget to add a fallback @OnJetstreamMessage() handler?')
    }

    return this.fallbackHandler
  }
}
