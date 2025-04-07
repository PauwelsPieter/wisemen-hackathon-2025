import { assert } from 'console'
import { ClassConstructor } from 'class-transformer'
import { DomainEventType } from './domain-event-type.js'
import { DomainEvent } from './domain-event.js'

const DOMAIN_EVENT_TYPE_KEY = Symbol('wisemen.domain-event-type')

export function RegisterDomainEvent (type: DomainEventType, version: number): ClassDecorator {
  return ((target: ClassConstructor<DomainEvent>): ClassConstructor<DomainEvent> => {
    Reflect.defineMetadata(DOMAIN_EVENT_TYPE_KEY, type, target)

    return class extends target {
      public type: DomainEventType = type
      public version: number = version
    }
  }) as ClassDecorator
}

export function getDomainEventType (target: ClassConstructor<DomainEvent>): DomainEventType {
  const type = Reflect.getMetadata(DOMAIN_EVENT_TYPE_KEY, target) as unknown
  assert(type !== undefined, 'type metadata not defined on domain event')
  return type as DomainEventType
}
