import { Msg, Subscription } from '@nats-io/transport-node'
import { Logger } from '@nestjs/common'
import { captureException } from '@sentry/nestjs'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { JsonApiError } from '../../../exceptions/types/json-api-error.type.js'
import { NatsMessageHandlerFunction } from '../message-handler/nats-message-handler.js'
import { CloudEventHandlerOptions } from '../message-handler/on-nats-message.decorator.js'
import { CloudEvent } from '../../../integration-events/cloud-event.js'

type CloudEventKey = string

export class NatsSubscription {
  private fallbackHandler: NatsMessageHandlerFunction | undefined
  private cloudEventHandlers: Map<CloudEventKey, NatsMessageHandlerFunction> = new Map()

  constructor (
    private readonly subscription: Subscription
  ) {}

  addCloudEventHandler (
    eventOptions: CloudEventHandlerOptions,
    handler: NatsMessageHandlerFunction
  ): void {
    const key = this.mapEventOptionsToKey(eventOptions)
    if (this.cloudEventHandlers.get(key) !== undefined) {
      throw new Error(`A cloud event handler already exists for `
        + `${eventOptions.type} (${eventOptions.specversion}) on`
        + ` subscriber ${this.subscription.getSubject()}`)
    }

    Logger.log('Registered cloud event handler on '
      + `subscriber ${this.subscription.getSubject()} for `
      + `${eventOptions.type} (${eventOptions.specversion})`, 'NATS')

    this.cloudEventHandlers.set(key, handler)
  }

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
      const handler = await this.getHandler(message)
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

  private async getHandler (message: Msg): Promise<NatsMessageHandlerFunction> {
    if (this.cloudEventHandlers.size > 0) {
      try {
        const cloudEventKey = await this.tryParseCloudEventKey(message)
        const handler = this.cloudEventHandlers.get(cloudEventKey)
        if (handler !== undefined) {
          return handler
        }
      } catch {
        // ignore non cloud events and fall through to fallback handler
      }
    }

    if (this.fallbackHandler === undefined) {
      throw new Error(`No handler found for message`
        + `on NATS subscriber ${this.subscription.getSubject()}.`
        + '\nDid you forget to add a fallback @OnNatsMessage() handler?')
    }

    return this.fallbackHandler
  }

  private async tryParseCloudEventKey (message: Msg): Promise<CloudEventKey> {
    const json = JSON.parse(new TextDecoder().decode(message.data)) as unknown
    const event = plainToInstance(CloudEvent, json)
    const errors = await validate(event, { whitelist: true, forbidNonWhitelisted: true })

    if (errors.length > 0) {
      throw new Error('Invalid cloud event')
    }

    return event.type + ':' + event.specversion
  }

  private mapEventOptionsToKey (event: CloudEventHandlerOptions): CloudEventKey {
    return event.type + ':' + event.specversion
  }
}
