import { Injectable } from '@nestjs/common'
import { DomainEvent } from './domain-event.js'

export type EventSubscriberMethod = (event: DomainEvent[]) => Promise<void>

@Injectable()
export class DomainEventEmitter {
  private static subscribers = new Map<string, EventSubscriberMethod[]>()
  private static globalSubscribers: EventSubscriberMethod[] = []

  static addSubscriber (toEvent: string, observer: EventSubscriberMethod): void {
    const eventSubscribers = this.subscribers.get(toEvent) ?? []

    eventSubscribers.push(observer)
    this.subscribers.set(toEvent, eventSubscribers)
  }

  static addGlobalSubscriber (observer: EventSubscriberMethod): void {
    this.globalSubscribers.push(observer)
  }

  async emitOne (event: DomainEvent): Promise<void> {
    await this.emit([event])
  }

  async emit<Event extends DomainEvent>(events: Event[]): Promise<void> {
    if (events.length === 0) {
      return
    }

    const subscribers = DomainEventEmitter.subscribers.get(events[0].type) ?? []

    for (const subscriberCallback of subscribers) {
      await subscriberCallback(events)
    }

    for (const subscriberCallback of DomainEventEmitter.globalSubscribers) {
      await subscriberCallback(events)
    }
  }
}
