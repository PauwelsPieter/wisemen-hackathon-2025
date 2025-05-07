import { ClassConstructor } from 'class-transformer'
import { Logger } from '@nestjs/common'
import { jetstream, jetstreamManager } from '@nats-io/jetstream'
import { NatsConnectionManager } from '../clients/nats-connection.manager.js'
import { NatsConsumption } from './nats-consumption.js'
import { getNatsConsumerConfig } from './nats-consumer.decorator.js'

export class NatsConsumerManager {
  private consumers: Map<string, NatsConsumption> = new Map()

  constructor (
    private readonly connectionManager: NatsConnectionManager,
    private readonly defaultClient?: ClassConstructor<unknown>
  ) {}

  async createConsumer (consumerClass: ClassConstructor<unknown>): Promise<NatsConsumption> {
    const existingConsumer = this.consumers.get(consumerClass.name)
    if (existingConsumer !== undefined) {
      return existingConsumer
    }

    const config = getNatsConsumerConfig(consumerClass)
    const client = config.client ?? this.defaultClient

    if (client === undefined) {
      throw new Error('No client specified'
        + '\nDid you forget to add a default client to the nats application?'
        + '\nDid you forget to set a specific client on the consumer options?'
      )
    }

    const connection = await this.connectionManager.connectWith(client)
    const jetStreamManager = await jetstreamManager(connection)
    const consumerInfo = await jetStreamManager.consumers.add(config.streamName, config)
    const consumer = await jetstream(connection).consumers.get(config.streamName, config)
    const consumption = new NatsConsumption(consumerInfo, consumer)

    Logger.log(`Registered consumer ${consumerInfo.name} on stream ${config.streamName} `, 'NATS')

    this.consumers.set(consumerClass.name, consumption)
    return consumption
  }

  startConsumers (): void {
    for (const subscriber of this.consumers.values()) {
      void subscriber.listen()
    }
  }
}
