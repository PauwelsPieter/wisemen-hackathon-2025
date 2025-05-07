import { Msg, Subscription } from '@nats-io/transport-node'
import { Logger } from '@nestjs/common'
import { captureException } from '@sentry/nestjs'
import { JsonApiError } from '../../../exceptions/types/json-api-error.type.js'
import { NatsMessageHandlerFunction } from '../message-handler/nats-message-handler.js'

export class NatsSubscription {
  private fallbackHandler: NatsMessageHandlerFunction | undefined
  constructor (
    private readonly subscription: Subscription
  ) {}

  addFallBackHandler (handler: NatsMessageHandlerFunction): void {
    if (this.fallbackHandler !== undefined) {
      throw new Error(`Fallback handler already set for ${this.subscription.getSubject()}`
        + `\nDid you add two @OnNatsMessage() handlers to one @NatsSubscriber({...})?`)
    }

    Logger.log('Registered fallback message handler on '
      + `subscriber ${this.subscription.getSubject()}`, 'NATS')

    this.fallbackHandler = handler
  }

  async listen (): Promise<void> {
    for await (const message of this.subscription) {
      // Handle  messages 1 by 1 for now
      await this.handleMessage(message)
    }
  }

  private async handleMessage (message: Msg): Promise<void> {
    try {
      const handler = this.getHandler(message)
      await handler.handle(message)
    } catch (e) {
      let message: string = 'unknown cause'
      if (e instanceof JsonApiError) {
        message = `[${e.status}]: ${JSON.stringify(e.errors)}`
      } else if (e instanceof Error) {
        message = e.message ?? 'unknown cause'
      }

      Logger.error(`Nats message handler threw error ${message}`, `NATS Subscriber ${this.subscription.getSubject()}`)
      captureException(e)
    }
  }

  private getHandler (_forMessage: Msg): NatsMessageHandlerFunction {
    if (this.fallbackHandler === undefined) {
      throw new Error(`No handler found for message`
        + `on NATS subscriber ${this.subscription.getSubject()}.`
        + '\nDid you forget to add a fallback @OnNatsMessage() handler?')
    }

    return this.fallbackHandler
  }
}
