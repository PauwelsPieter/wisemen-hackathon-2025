import { ClassConstructor } from 'class-transformer'
import { ServiceConfig } from '@nats-io/services'
import { applyDecorators, Injectable } from '@nestjs/common'

const NATS_SERVICE_KEY = Symbol('wisemen.nats-service')
export interface NatsServiceConfig extends ServiceConfig {
  /** The Nats Client specified with a @NatsClient decorator */
  client?: ClassConstructor<unknown>
}

export function NatsService (options: NatsServiceConfig): ClassDecorator {
  return applyDecorators(
    Injectable(),
    (target: ClassConstructor<unknown>): void => {
      Reflect.defineMetadata(NATS_SERVICE_KEY, options, target)
    }
  )
}

export function isNatsService (target: ClassConstructor<unknown>): boolean {
  return Reflect.getMetadata(NATS_SERVICE_KEY, target) !== undefined
}

export function getNatsServiceConfig (target: ClassConstructor<unknown>): NatsServiceConfig {
  const options = Reflect.getMetadata(NATS_SERVICE_KEY, target) as unknown

  if (options === undefined) {
    throw new Error(`${target.name} is not a valid nats service\nDid you forget to add the @NatsService({...}) decorator?`)
  }

  return options as NatsServiceConfig
}
