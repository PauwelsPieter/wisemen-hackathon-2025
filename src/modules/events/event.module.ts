/* eslint-disable @typescript-eslint/no-explicit-any */
import { Module, OnApplicationBootstrap, Type } from '@nestjs/common'
import { ModulesContainer } from '@nestjs/core'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper.js'
import { EventsMap, SUBSCRIBE_KEY } from './subscribe.decorator.js'
import { EventEmitter, EventSubscriberMethod } from './event-emitter.js'
import { SUBSCRIBE_ALL_KEY, SubscribeAllMethodNames } from './subscribe-all.decorator.js'

@Module({
  providers: [EventEmitter],
  exports: [EventEmitter]
})
export class EventModule implements OnApplicationBootstrap {
  constructor (private readonly modulesContainer: ModulesContainer) {}

  onApplicationBootstrap () {
    for (const moduleWrapper of this.modulesContainer.values()) {
      for (const providerWrapper of moduleWrapper.providers.values()) {
        this.registerSubscribers(providerWrapper)
      }
    }
  }

  private registerSubscribers (providerWrapper: InstanceWrapper<unknown>) {
    const providerClass = providerWrapper.metatype

    if (providerClass == null) {
      return
    }

    if (!Object.hasOwn(providerClass, 'prototype')) {
      return
    }

    this.addEventSubscribers(providerClass as Type<unknown>, providerWrapper.instance)
    this.addGlobalSubscribers(providerClass as Type<unknown>, providerWrapper.instance)
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

        EventEmitter.addSubscriber(eventType, observer.bind(instance) as EventSubscriberMethod)
      }
    }
  }

  private addGlobalSubscribers (providerClass: Type<unknown>, instance: any) {
    const globalSubscriberMethodNames = this.extractGlobalSubscribers(providerClass)

    for (const methodName of globalSubscriberMethodNames) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const observer = instance[methodName] as EventSubscriberMethod

      EventEmitter.addGlobalSubscriber(observer.bind(instance) as EventSubscriberMethod)
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
