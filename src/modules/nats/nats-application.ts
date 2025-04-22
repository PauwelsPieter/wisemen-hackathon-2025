import { ClassConstructor } from 'class-transformer'
import { ServiceMsg, Svcm } from '@nats-io/services'
import { QueuedIterator } from '@nats-io/transport-node'
import { Logger, Type } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NatsConnectionManager } from './nats-connection.manager.js'
import { getNatsServiceConfig } from './nats-service.decorator.js'
import { getNatsServiceEndpoints } from './nats-service-endpoint.decorator.js'

type ServiceMessageHandler = (message: ServiceMsg) => Promise<unknown>

export class NatsApplication {
  private readonly connectionManager: NatsConnectionManager
  constructor (
    private readonly configService: ConfigService,
    private readonly defaultClient?: ClassConstructor<unknown>
  ) {
    this.connectionManager = new NatsConnectionManager(configService)
  }

  async addService (serviceClass: ClassConstructor<unknown>, instance: object): Promise<void> {
    const serviceConfig = getNatsServiceConfig(serviceClass)
    const serviceEndpoint = getNatsServiceEndpoints(serviceClass.prototype as Type<unknown>)

    const client = serviceConfig.client ?? this.defaultClient

    if (client === undefined) {
      throw new Error('No client specified'
        + '\nDid you forget to add a default client to the nats application?'
        + '\nDid you forget to set a specific client on the service config?'
      )
    }

    const connection = await this.connectionManager.connectWith(client)
    const service = await new Svcm(connection).add(serviceConfig)

    Logger.log(`Registered service ${serviceConfig.name} (${serviceConfig.version})`, 'NATS')

    for (const [methodName, options] of serviceEndpoint.entries()) {
      const endpoint = service.addEndpoint(options.name, options)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const boundMethod = instance[methodName]
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        .bind(instance) as ServiceMessageHandler
      void this.startEndpoint(endpoint, boundMethod)

      Logger.log(`Registered endpoint ${options.name} listening on ${options?.subject ?? 'no subject'}`, 'NATS')
    }
  }

  private async startEndpoint (
    endpoint: QueuedIterator<ServiceMsg>,
    handler: ServiceMessageHandler
  ): Promise<void> {
    for await (const message of endpoint) {
      void this.handleMessageOnEndpoint(message, handler)
    }
  }

  private async handleMessageOnEndpoint (
    message: ServiceMsg,
    handler: ServiceMessageHandler
  ): Promise<void> {
    try {
      const response = await handler(message)
      if (typeof response === 'string') {
        message.respond(new TextEncoder().encode(response))
      } else if (typeof response === 'object') {
        message.respond(new TextEncoder().encode(JSON.stringify(response)))
      } else {
        throw new Error(`unsupported type of response ${typeof response}`)
      }
    } catch (e) {
      message.respondError(500, (e as Error).message, JSON.stringify(e))
    }
  }
}
