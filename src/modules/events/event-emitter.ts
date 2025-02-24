import { Injectable } from '@nestjs/common'
import { WiseEvent } from './wise-event.js'

export type EventSubscriberMethod = (event: WiseEvent) => Promise<void>

@Injectable()
export class EventEmitter {
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

  async emit (event: WiseEvent): Promise<void> {
    const subscribers = EventEmitter.subscribers.get(event.type) ?? []

    for (const subscriberCallback of subscribers) {
      await subscriberCallback(event)
    }

    for (const subscriberCallback of EventEmitter.globalSubscribers) {
      await subscriberCallback(event)
    }
  }
}
