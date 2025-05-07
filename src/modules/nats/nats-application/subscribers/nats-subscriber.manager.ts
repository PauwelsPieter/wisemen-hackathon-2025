import { ClassConstructor } from 'class-transformer'
import { Logger } from '@nestjs/common'
import { NatsConnectionManager } from '../clients/nats-connection.manager.js'
import { NatsSubscription } from './nats-subscription.js'
import { getNatsSubscriberOptions } from './nats-subscriber.decorator.js'

export class NatsSubscriberManager {
  private subscribers: Map<string, NatsSubscription> = new Map()

  constructor (
    private readonly connectionManager: NatsConnectionManager,
    private readonly defaultClient?: ClassConstructor<unknown>
  ) {}

  async createSubscriber (subscriberClass: ClassConstructor<unknown>): Promise<NatsSubscription> {
    const existingSubscriber = this.subscribers.get(subscriberClass.name)
    if (existingSubscriber !== undefined) {
      return existingSubscriber
    }

    const subscriberOptions = getNatsSubscriberOptions(subscriberClass)
    const client = subscriberOptions.client ?? this.defaultClient

    if (client === undefined) {
      throw new Error('No client specified'
        + '\nDid you forget to add a default client to the nats application?'
        + '\nDid you forget to set a specific client on the subscriber options?'
      )
    }

    const connection = await this.connectionManager.connectWith(client)
    const rawSubscription = connection.subscribe(subscriberOptions.subject, subscriberOptions)
    const subscription = new NatsSubscription(rawSubscription)

    Logger.log(`Subscribed to subject ${subscriberOptions.subject}`, 'NATS')

    this.subscribers.set(subscriberClass.name, subscription)
    return subscription
  }

  startSubscribers (): void {
    for (const subscriber of this.subscribers.values()) {
      void subscriber.listen()
    }
  }
}
