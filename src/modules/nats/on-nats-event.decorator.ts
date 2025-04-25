import { ClassConstructor } from 'class-transformer'
import { applyDecorators } from '@nestjs/common'

const NATS_ON_MESSAGE_KEY = Symbol('wisemen.nats-on-message')

export interface OnNatsMessageOptions {
  subscriber?: ClassConstructor<unknown>
}

export interface OnNatsMessageConfig {
  subscriber?: ClassConstructor<unknown>
  methodName: string
}

export function OnNatsMessage (options?: OnNatsMessageOptions): MethodDecorator {
  return applyDecorators(
    (target: ClassConstructor<unknown>, methodName: string): void => {
      const config = Reflect.getMetadata(
        NATS_ON_MESSAGE_KEY,
        target
      ) as OnNatsMessageConfig[] ?? []

      config.push({ ...options, methodName })

      Reflect.defineMetadata(NATS_ON_MESSAGE_KEY, config, target)
    }
  )
}

export function isNatsMessageHandler (target: ClassConstructor<unknown>): boolean {
  return Reflect.getMetadata(NATS_ON_MESSAGE_KEY, target.prototype as object) !== undefined
}

export function getNatsMessageHandlerConfig (
  target: ClassConstructor<unknown>
): OnNatsMessageConfig[] {
  const config = Reflect.getMetadata(
    NATS_ON_MESSAGE_KEY,
    target.prototype as object
  ) as undefined | OnNatsMessageConfig[]

  if (config === undefined) {
    throw new Error(`${target.name} is not a valid nats message handler\n`
      + `Did you forget to add the @OnNatsMessage({...}) decorator?`)
  }

  return config
}
