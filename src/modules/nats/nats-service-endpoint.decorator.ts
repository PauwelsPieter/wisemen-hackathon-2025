import { ClassConstructor } from 'class-transformer'
import { EndpointOptions } from '@nats-io/services'

const NATS_SERVICE_ENDPOINT_KEY = Symbol('wisemen.nats-service-endpoint')

type MethodName = string
export interface NatsEndpointOptions extends EndpointOptions {
  name: string
}
export type NatsEndpointsConfig = Map<MethodName, NatsEndpointOptions>

export function NatsServiceEndpoint (options: NatsEndpointOptions): MethodDecorator {
  return (target: object, methodName: MethodName): void => {
    const endpoints = Reflect.getMetadata(
      NATS_SERVICE_ENDPOINT_KEY,
      target
    ) as NatsEndpointsConfig ?? new Map()

    endpoints.set(methodName, options)

    Reflect.defineMetadata(NATS_SERVICE_ENDPOINT_KEY, endpoints, target)
  }
}

export function getNatsServiceEndpoints (target: ClassConstructor<unknown>): NatsEndpointsConfig {
  const options = Reflect.getMetadata(NATS_SERVICE_ENDPOINT_KEY, target) as unknown

  if (options === undefined) {
    throw new Error(`${target.name} does not have nats endpoints\nDid you forget to add the @NatsServiceEndpoint({...}) decorator?`)
  }

  return options as NatsEndpointsConfig
}
