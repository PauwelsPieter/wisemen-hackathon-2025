import { ClassConstructor } from 'class-transformer'
import { DomainEvent } from './domain-event.js'
import { getDomainEventType } from './register-domain-event.decorator.js'

export const SUBSCRIBE_KEY = 'wisemen.subscribe'

type SubScribingMethodName = string
export type EventsMap = Map<string, SubScribingMethodName[]>

/** Subscribe to Domain Event */
export function Subscribe (event: ClassConstructor<DomainEvent>): MethodDecorator {
  return (target: object, methodName: string) => {
    const observedEventsMap = Reflect.getMetadata(SUBSCRIBE_KEY, target) as EventsMap | undefined
      ?? new Map<string, SubScribingMethodName[]>()

    const eventType = getDomainEventType(event)
    const observingMethods = observedEventsMap.get(eventType) ?? []

    observingMethods.push(methodName)

    observedEventsMap.set(eventType, observingMethods)
    Reflect.defineMetadata(SUBSCRIBE_KEY, observedEventsMap, target)
  }
}
