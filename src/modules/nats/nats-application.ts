/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ClassConstructor } from 'class-transformer'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NatsConnectionManager } from './nats-connection.manager.js'
import { getNatsServiceEndpoints } from './nats-service-endpoint.decorator.js'
import { NatsServiceManager } from './nats-service.manager.js'
import { NatsServiceEndpointHandler, ServiceMessageHandlerFunction } from './nats-service-endpoint.handler.js'
import { getNatsMessageHandlerConfig } from './on-nats-event.decorator.js'
import { NatsSubscriberManager } from './nats-subscriber.manager.js'
import { NatsMessageHandlerFunction } from './nats-subscription.js'

export class NatsApplication {
  private readonly connectionManager: NatsConnectionManager
  private readonly serviceManager: NatsServiceManager
  private readonly subscriberManager: NatsSubscriberManager

  constructor (
    private readonly configService: ConfigService,
    private readonly defaultClient?: ClassConstructor<unknown>
  ) {
    this.connectionManager = new NatsConnectionManager(configService)
    this.serviceManager = new NatsServiceManager(this.connectionManager, this.defaultClient)
    this.subscriberManager = new NatsSubscriberManager(this.connectionManager, this.defaultClient)
  }

  async addServiceEndpoints (
    endpointsClass: ClassConstructor<unknown>,
    instance: object
  ): Promise<void> {
    const serviceEndpoint = getNatsServiceEndpoints(endpointsClass)

    for (const [methodName, options] of serviceEndpoint.entries()) {
      const serviceClass = options.service ?? endpointsClass
      const service = await this.serviceManager.createService(serviceClass)

      const endpoint = service.addEndpoint(options.name, options)
      const boundMethod = instance[methodName].bind(instance) as ServiceMessageHandlerFunction
      const endpointHandler = new NatsServiceEndpointHandler(endpoint, boundMethod)
      void endpointHandler.listen()

      Logger.log(`Registered endpoint ${options.name} in ${service.info().name} `
        + `(${service.info().version}) listening on ${options?.subject ?? 'no subject'}`, 'NATS')
    }
  }

  async addMessageHandler (
    handlerClass: ClassConstructor<unknown>,
    instance: object
  ): Promise<void> {
    const handlerConfig = getNatsMessageHandlerConfig(handlerClass)
    for (const { methodName, ...options } of handlerConfig) {
      const handler = instance[methodName].bind(instance) as NatsMessageHandlerFunction
      const subscriberClass = options.subscriber ?? handlerClass
      const subcriber = await this.subscriberManager.createSubscriber(subscriberClass)
      subcriber.addFallBackHandler(handler)
    }
  }

  listen (): void {
    this.subscriberManager.startSubscribers()
  }

  async close (): Promise<void> {
    await this.connectionManager.drainConnections()
  }
}
