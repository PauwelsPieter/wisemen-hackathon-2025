import { applyDecorators } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ClassConstructor } from 'class-transformer'
import { ALL_TYPES } from './constants.js'
import { WiseEvent } from './wise-event.js'

export function Subscribe (toTopic: string): MethodDecorator
export function Subscribe<T extends ClassConstructor<WiseEvent> & { TYPE: string } > (
  toEvent: T
): MethodDecorator
export function Subscribe (toTopic: string | { TYPE: string }): MethodDecorator {
  let topic: string

  if (typeof toTopic === 'string') {
    topic = toTopic
  } else {
    topic = toTopic.TYPE
  }

  return applyDecorators(OnEvent(topic, { suppressErrors: false }))
}

export function SubscribeToAll (): MethodDecorator {
  return applyDecorators(OnEvent(ALL_TYPES, { suppressErrors: false }))
}
