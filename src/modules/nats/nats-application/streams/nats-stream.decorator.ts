import { ClassConstructor } from 'class-transformer'
import { ConfigService } from '@nestjs/config'
import { StreamAPI } from '@nats-io/jetstream'

const NATS_STREAM_KEY = Symbol('wisemen.nats-stream')
type StreamConfig = Parameters<StreamAPI['add']>['0'] & {
  client?: ClassConstructor<unknown>
}
export type NatsStreamConfigFunction = (configService: ConfigService) => StreamConfig

export function NatsStream (options: NatsStreamConfigFunction): ClassDecorator {
  return ((target: ClassConstructor<unknown>): void => {
    Reflect.defineMetadata(NATS_STREAM_KEY, options, target)
  }) as ClassDecorator
}

export function getNatsStreamConfig (
  client: ClassConstructor<unknown>
): NatsStreamConfigFunction {
  const options = Reflect.getMetadata(NATS_STREAM_KEY, client) as unknown

  if (options === undefined) {
    throw new Error(`${client.name} is not a valid nats client\nDid you forget to add the @NatsStream({...}) decorator?`)
  }

  return options as NatsStreamConfigFunction
}
