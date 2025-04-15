import { Injectable } from '@nestjs/common'
import { Span } from '@opentelemetry/api'
import { getOtelTracer } from '../../utils/opentelemetry/get-otel-tracer.js'
import { DomainEvent } from './domain-event.js'
import { DomainEventType } from './domain-event-type.js'

export type EventSubscriberMethod = (event: DomainEvent[]) => Promise<void>

@Injectable()
export class DomainEventEmitter {
  private static subscribers = new Map<string, EventSubscriberMethod[]>()
  private static globalSubscribers: EventSubscriberMethod[] = []

  static addSubscriber (toEvent: string, subscriber: EventSubscriberMethod): void {
    const eventSubscribers = this.subscribers.get(toEvent) ?? []

    eventSubscribers.push(subscriber)
    this.subscribers.set(toEvent, eventSubscribers)
  }

  static addGlobalSubscriber (subscriber: EventSubscriberMethod): void {
    this.globalSubscribers.push(subscriber)
  }

  async emitOne (event: DomainEvent): Promise<void> {
    await this.emit([event])
  }

  async emit<Event extends DomainEvent>(events: Event[]): Promise<void> {
    if (events.length === 0) {
      return
    }

    const eventsPerType = new Map<DomainEventType, Event[]>()
    for (const event of events) {
      const events = eventsPerType.get(event.type) ?? []
      events.push(event)
      eventsPerType.set(event.type, events)
    }

    for (const [eventType, eventsOfType] of eventsPerType.entries()) {
      await this.emitEventsOfType<Event>(eventType, eventsOfType)
    }
  }

  private async emitEventsOfType<Event extends DomainEvent>(
    eventType: DomainEventType,
    eventsOfType: Event[]
  ): Promise<void> {
    const tracer = getOtelTracer()

    await tracer.startActiveSpan('emitting domain event(s)', async (span: Span) => {
      span.setAttribute('domain-event.type', eventType)
      try {
        await this.tryEmitEventsOfType<Event>(eventType, eventsOfType)
      } finally {
        span.end()
      }
    })
  }

  private async tryEmitEventsOfType<Event extends DomainEvent>(
    eventType: DomainEventType,
    eventsOfType: Event[]
  ): Promise<void> {
    const subscribers = DomainEventEmitter.subscribers.get(eventType) ?? []

    for (const subscriberCallback of subscribers) {
      await subscriberCallback(eventsOfType)
    }

    for (const subscriberCallback of DomainEventEmitter.globalSubscribers) {
      await subscriberCallback(eventsOfType)
    }
  }
}
