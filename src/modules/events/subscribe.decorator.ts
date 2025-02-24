import { ClassConstructor } from 'class-transformer'
import { WiseEvent } from './wise-event.js'

export const SUBSCRIBE_KEY = 'wisemen.subscribe'

type SubScribingMethodName = string
export type EventsMap = Map<string, SubScribingMethodName[]>
type TypedEvent = ClassConstructor<WiseEvent> & { TYPE: string }

export function Subscribe<EventType extends TypedEvent> (event: EventType): MethodDecorator {
  return (target: object, methodName: string) => {
    const observedEventsMap = Reflect.getMetadata(SUBSCRIBE_KEY, target) as EventsMap | undefined
      ?? new Map<string, SubScribingMethodName[]>()

    const observingMethods = observedEventsMap.get(event.TYPE) ?? []

    observingMethods.push(methodName)

    observedEventsMap.set(event.TYPE, observingMethods)
    Reflect.defineMetadata(SUBSCRIBE_KEY, observedEventsMap, target)
  }
}
