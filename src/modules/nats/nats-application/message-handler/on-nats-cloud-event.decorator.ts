import { ClassConstructor } from 'class-transformer'
import { OnMessageConsumerOptions, OnMessageSubscriberOptions, OnNatsMessage } from './on-nats-message.decorator.js'

export function OnNatsCloudEvent (options: {
  type: string
  version: string
  subscriber?: ClassConstructor<unknown>
}): MethodDecorator
export function OnNatsCloudEvent (options: {
  type: string
  version: string
  consumer?: ClassConstructor<unknown>
}): MethodDecorator
export function OnNatsCloudEvent (options: {
  type: string
  version: string
  subscriber?: ClassConstructor<unknown>
  consumer?: ClassConstructor<unknown>
}): MethodDecorator {
  return OnNatsMessage({
    event: {
      type: options.type,
      specversion: options.version
    },
    subscriber: options.subscriber,
    consumer: options.consumer
  } as OnMessageSubscriberOptions | OnMessageConsumerOptions)
}
