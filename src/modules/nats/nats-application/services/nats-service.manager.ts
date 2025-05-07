import { ClassConstructor } from 'class-transformer'
import { Logger } from '@nestjs/common'
import { Service, Svcm } from '@nats-io/services'
import { NatsConnectionManager } from '../clients/nats-connection.manager.js'
import { getNatsServiceConfig } from './nats-service.decorator.js'

export class NatsServiceManager {
  private services: Map<string, Service> = new Map()

  constructor (
    private readonly connectionManager: NatsConnectionManager,
    private readonly defaultClient?: ClassConstructor<unknown>
  ) {}

  async createService (serviceClass: ClassConstructor<unknown>): Promise<Service> {
    const existingService = this.services.get(serviceClass.name)
    if (existingService !== undefined) {
      return existingService
    }

    const serviceConfig = getNatsServiceConfig(serviceClass)
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

    this.services.set(serviceClass.name, service)
    return service
  }
}
