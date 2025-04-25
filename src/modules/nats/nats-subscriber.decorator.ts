import { ClassConstructor } from 'class-transformer'
import { applyDecorators, Injectable } from '@nestjs/common'
import { SubscriptionOptions } from '@nats-io/transport-node'

const NATS_SUBSCRIBER_KEY = Symbol('wisemen.nats-subscriber')
export interface NatsSubscriptionOptions extends Omit<SubscriptionOptions, 'callback'> {
  /** The Nats Client specified with a @NatsClient decorator */
  client?: ClassConstructor<unknown>
  subject: string
}

export function NatsSubscriber (options: NatsSubscriptionOptions): ClassDecorator {
  return applyDecorators(
    Injectable(),
    (target: ClassConstructor<unknown>): void => {
      Reflect.defineMetadata(NATS_SUBSCRIBER_KEY, options, target)
    }
  )
}

export function isNatsSubscriber (target: ClassConstructor<unknown>): boolean {
  return Reflect.getMetadata(NATS_SUBSCRIBER_KEY, target) !== undefined
}

export function getNatsSubscriberOptions (
  target: ClassConstructor<unknown>
): NatsSubscriptionOptions {
  const options = Reflect.getMetadata(NATS_SUBSCRIBER_KEY, target) as unknown

  if (options === undefined) {
    throw new Error(`${target.name} is not a valid nats subscriber\n`
      + `Did you forget to add the @NatsSubscriber({...}) decorator?`)
  }

  return options as NatsSubscriptionOptions
}
