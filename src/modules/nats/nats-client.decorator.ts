import { ClassConstructor } from 'class-transformer'
import { ConnectionOptions } from '@nats-io/transport-node'
import { ConfigService } from '@nestjs/config'

const NATS_CLIENT_KEY = Symbol('wisemen.nats-client')
export type NatsClientConfigFunction = (configService: ConfigService) => ConnectionOptions

export function NatsClient (options: NatsClientConfigFunction): ClassDecorator {
  return ((target: ClassConstructor<unknown>): void => {
    Reflect.defineMetadata(NATS_CLIENT_KEY, options, target)
  }) as ClassDecorator
}

export function getNatsConnectionOptions (
  client: ClassConstructor<unknown>
): NatsClientConfigFunction {
  const options = Reflect.getMetadata(NATS_CLIENT_KEY, client) as unknown

  if (options === undefined) {
    throw new Error(`${client.name} is not a valid nats client\nDid you forget to add the @NatsClient({...}) decorator?`)
  }

  return options as NatsClientConfigFunction
}
