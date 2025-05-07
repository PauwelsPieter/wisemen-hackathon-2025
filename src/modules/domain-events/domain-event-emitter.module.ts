/* eslint-disable @typescript-eslint/no-explicit-any */
import { Module, OnApplicationBootstrap, Type } from '@nestjs/common'
import { ProvidersExplorerModule } from '../../utils/providers/providers-explorer.module.js'
import { ProvidersExplorer } from '../../utils/providers/providers-explorer.js'
import { EventsMap, SUBSCRIBE_KEY } from './subscribe.decorator.js'
import { DomainEventEmitter, EventSubscriberMethod } from './domain-event-emitter.js'
import { SUBSCRIBE_ALL_KEY, SubscribeAllMethodNames } from './subscribe-all.decorator.js'

@Module({
  imports: [ProvidersExplorerModule],
  providers: [DomainEventEmitter],
  exports: [DomainEventEmitter]
})
export class DomainEventEmitterModule implements OnApplicationBootstrap {
  constructor (private readonly providerExplorer: ProvidersExplorer) {}

  onApplicationBootstrap () {
    for (const { providerClass, providerInstance } of this.providerExplorer.providers) {
      this.addEventSubscribers(providerClass, providerInstance)
      this.addGlobalSubscribers(providerClass, providerInstance)
    }
  }

  private addEventSubscribers (providerClass: Type<unknown>, instance: any) {
    const eventMap = this.extractEventMap(providerClass)

    if (eventMap === undefined) {
      return
    }

    for (const [eventType, methodNames] of eventMap.entries()) {
      for (const methodName of methodNames) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const observer = instance[methodName] as EventSubscriberMethod
        const boundObserver = observer.bind(instance) as EventSubscriberMethod
        DomainEventEmitter.addSubscriber(eventType, boundObserver)
      }
    }
  }

  private addGlobalSubscribers (providerClass: Type<unknown>, instance: any) {
    const globalSubscriberMethodNames = this.extractGlobalSubscribers(providerClass)

    for (const methodName of globalSubscriberMethodNames) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const observer = instance[methodName] as EventSubscriberMethod

      DomainEventEmitter.addGlobalSubscriber(observer.bind(instance) as EventSubscriberMethod)
    }
  }

  private extractEventMap (providerClass: Type<unknown>) {
    return Reflect.getMetadata(
      SUBSCRIBE_KEY,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      providerClass.prototype
    ) as EventsMap | undefined
  }

  private extractGlobalSubscribers (providerClass: Type<unknown>) {
    return Reflect.getMetadata(
      SUBSCRIBE_ALL_KEY,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      providerClass.prototype
    ) as SubscribeAllMethodNames ?? []
  }
}
