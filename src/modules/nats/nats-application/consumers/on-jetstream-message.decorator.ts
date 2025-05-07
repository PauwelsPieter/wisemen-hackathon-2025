import { ClassConstructor } from 'class-transformer'
import { applyDecorators } from '@nestjs/common'

const JETSTREAM_ON_MESSAGE_KEY = Symbol('wisemen.jetstream-on-message')

export interface OnJetstreamMessageOptions {
  consumer?: ClassConstructor<unknown>
}

export interface OnJetstreamMessageConfig {
  consumer?: ClassConstructor<unknown>
  methodName: string
}

export function OnJetstreamMessage (options?: OnJetstreamMessageOptions): MethodDecorator {
  return applyDecorators(
    (target: ClassConstructor<unknown>, methodName: string): void => {
      const config = Reflect.getMetadata(
        JETSTREAM_ON_MESSAGE_KEY,
        target
      ) as OnJetstreamMessageConfig[] ?? []

      config.push({ ...options, methodName })

      Reflect.defineMetadata(JETSTREAM_ON_MESSAGE_KEY, config, target)
    }
  )
}

export function isJetstreamMessageHandler (target: ClassConstructor<unknown>): boolean {
  return Reflect.getMetadata(JETSTREAM_ON_MESSAGE_KEY, target.prototype as object) !== undefined
}

export function getJetstreamMessageHandlerConfig (
  target: ClassConstructor<unknown>
): OnJetstreamMessageConfig[] {
  const config = Reflect.getMetadata(
    JETSTREAM_ON_MESSAGE_KEY,
    target.prototype as object
  ) as undefined | OnJetstreamMessageConfig[]

  if (config === undefined) {
    throw new Error(`${target.name} is not a valid nats message handler\n`
      + `Did you forget to add the @OnJetstreamMessage({...}) decorator?`)
  }

  return config
}
