/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ClassConstructor } from 'class-transformer'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { jetstreamManager } from '@nats-io/jetstream'
import { getNatsMessageHandlerConfig } from './message-handler/on-nats-message.decorator.js'
import { NatsConnectionManager } from './clients/nats-connection.manager.js'
import { getNatsServiceEndpoints } from './services/nats-service-endpoint.decorator.js'
import { NatsServiceManager } from './services/nats-service.manager.js'
import { NatsServiceEndpointHandler, ServiceMessageHandlerFunction } from './services/nats-service-endpoint.handler.js'
import { NatsSubscriberManager } from './subscribers/nats-subscriber.manager.js'
import { NatsConsumerManager } from './consumers/nats-consumer.manager.js'
import { getNatsStreamConfig } from './streams/nats-stream.decorator.js'
import { NatsMessageHandlerFunction } from './message-handler/nats-message-handler.js'
import { isNatsSubscriber } from './subscribers/nats-subscriber.decorator.js'
import { isNatsConsumer } from './consumers/nats-consumer.decorator.js'

export class NatsApplication {
  private readonly connectionManager: NatsConnectionManager
  private readonly serviceManager: NatsServiceManager
  private readonly subscriberManager: NatsSubscriberManager
  private readonly consumerManager: NatsConsumerManager

  constructor (
    private readonly configService: ConfigService,
    private readonly defaultClient?: ClassConstructor<unknown>
  ) {
    this.connectionManager = new NatsConnectionManager(configService)
    this.serviceManager = new NatsServiceManager(this.connectionManager, this.defaultClient)
    this.subscriberManager = new NatsSubscriberManager(
      this.connectionManager,
      configService,
      this.defaultClient
    )
    this.consumerManager = new NatsConsumerManager(this.connectionManager, this.defaultClient)
  }

  async createStream (stream: ClassConstructor<unknown>): Promise<void> {
    const streamConfig = getNatsStreamConfig(stream)(this.configService)
    const client = streamConfig.client ?? this.defaultClient

    if (client === undefined) {
      throw new Error('No client specified'
        + '\nDid you forget to add a default client to the nats application?'
        + '\nDid you forget to set a specific client on the consumer options?'
      )
    }

    const connection = await this.connectionManager.connectWith(client)
    const jetsstreamManager = await jetstreamManager(connection)
    await jetsstreamManager.streams.add(streamConfig)
    Logger.log(`Created stream ${streamConfig.name}`, 'NATS')
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
      const handler = new NatsMessageHandlerFunction({ handlerClass, instance, methodName })

      if ('subscriber' in options || isNatsSubscriber(handlerClass)) {
        const subscriberClass = options['subscriber'] as ClassConstructor<unknown> ?? handlerClass
        const subcriber = await this.subscriberManager.createSubscriber(subscriberClass)
        subcriber.addFallBackHandler(handler)
      } else if ('consumer' in handlerConfig || isNatsConsumer(handlerClass)) {
        const consumerClass = options['subscriber'] as ClassConstructor<unknown> ?? handlerClass
        const consumer = await this.consumerManager.createConsumer(consumerClass)
        consumer.addFallBackHandler(handler)
      } else {
        throw new Error('No subscriber or consumer configured for message handler.'
          + '\nDid you forget to add a `subscriber` or `consumer` in the options of the handler?'
          + '\nDid you forget to add `@NatsSubscriber(...)` or `@NatsConsumer(...)` to the class on'
          + ' which the handler is defined?'
        )
      }
    }
  }

  listen (): void {
    this.subscriberManager.startSubscribers()
    this.consumerManager.startConsumers()
  }

  async close (): Promise<void> {
    await this.connectionManager.drainConnections()
  }
}
