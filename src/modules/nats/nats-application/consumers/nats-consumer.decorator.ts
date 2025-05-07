import { ClassConstructor } from 'class-transformer'
import { applyDecorators, Injectable } from '@nestjs/common'
import { ConsumerConfig } from '@nats-io/jetstream'

const NATS_CONSUMER_KEY = Symbol('wisemen.nats-consumer')
export interface NatsConsumerConfig extends Omit<ConsumerConfig, 'callback'> {
  /** The Nats Client specified with a @NatsClient decorator */
  client?: ClassConstructor<unknown>
  streamName: string
}

export function NatsConsumer (options: NatsConsumerConfig): ClassDecorator {
  return applyDecorators(
    Injectable(),
    (target: ClassConstructor<unknown>): void => {
      Reflect.defineMetadata(NATS_CONSUMER_KEY, options, target)
    }
  )
}

export function isNatsConsumer (target: ClassConstructor<unknown>): boolean {
  return Reflect.getMetadata(NATS_CONSUMER_KEY, target) !== undefined
}

export function getNatsConsumerConfig (
  target: ClassConstructor<unknown>
): NatsConsumerConfig {
  const options = Reflect.getMetadata(NATS_CONSUMER_KEY, target) as unknown

  if (options === undefined) {
    throw new Error(`${target.name} is not a valid nats subscriber\n`
      + `Did you forget to add the @NatsConsumer({...}) decorator?`)
  }

  return options as NatsConsumerConfig
}
