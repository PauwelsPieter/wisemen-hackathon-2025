import { Consumer, ConsumerInfo, JsMsg } from '@nats-io/jetstream'
import { Logger } from '@nestjs/common'
import { captureException } from '@sentry/nestjs'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CloudEventHandlerOptions } from '../message-handler/on-nats-message.decorator.js'
import { NatsMessageHandlerFunction } from '../message-handler/nats-message-handler.js'
import { CloudEvent } from '../../../integration-events/cloud-event.js'

type CloudEventKey = string

export class NatsConsumption {
  private fallbackHandler: NatsMessageHandlerFunction | undefined
  private cloudEventHandlers: Map<CloudEventKey, NatsMessageHandlerFunction> = new Map()
  constructor (
    private readonly consumerInfo: ConsumerInfo,
    private readonly consumer: Consumer
  ) {}

  addCloudEventHandler (
    eventOptions: CloudEventHandlerOptions,
    handler: NatsMessageHandlerFunction
  ): void {
    const key = this.mapEventOptionsToKey(eventOptions)
    if (this.cloudEventHandlers.get(key) !== undefined) {
      throw new Error(`A cloud event handler already exists for `
        + `${eventOptions.type} (${eventOptions.specversion}) on `
        + `consumer ${this.consumerInfo.name}`)
    }

    Logger.log('Registered cloud event handler on '
      + `consumer ${this.consumerInfo.name} for `
      + `${eventOptions.type} (${eventOptions.specversion})`, 'NATS')

    this.cloudEventHandlers.set(key, handler)
  }

  addFallBackHandler (handler: NatsMessageHandlerFunction): void {
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
      const handler = await this.getHandler(message)
      await handler.handle(message)
      message.ack()
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'unknown cause'
      Logger.error(`Nats message handler threw error ${errorMessage}`, `NATS consumer ${this.consumerInfo.name}`)
      captureException(e)
      message.nak()
    }
  }

  private async getHandler (message: JsMsg): Promise<NatsMessageHandlerFunction> {
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
        + `on NATS consumer ${this.consumerInfo.name}.`
        + '\nDid you forget to add a fallback @OnJetstreamMessage() handler?')
    }

    return this.fallbackHandler
  }

  private async tryParseCloudEventKey (message: JsMsg): Promise<CloudEventKey> {
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
