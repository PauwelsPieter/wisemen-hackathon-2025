import { Inject, Injectable } from '@nestjs/common'
import { ModulesContainer } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ClassConstructor } from 'class-transformer'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper.js'
import { isNatsMessageHandler } from './subscribers/on-nats-message.decorator.js'
import { NatsApplication } from './nats-application.js'
import { holdsNatsServiceEndpoints } from './services/nats-service-endpoint.decorator.js'
import { isJetstreamMessageHandler } from './consumers/on-jetstream-message.decorator.js'

@Injectable()
export class NatsApplicationFactory {
  constructor (
    private readonly modulesContainer: ModulesContainer,
    private readonly configService: ConfigService,
    @Inject('DEFAULT_NATS_CLIENT') private readonly defaultClient?: ClassConstructor<unknown>,
    @Inject('NATS_STREAMS') private readonly streams?: ClassConstructor<unknown>[]
  ) {}

  async createApp (): Promise<NatsApplication> {
    const app = new NatsApplication(this.configService, this.defaultClient)

    for (const stream of this.streams ?? []) {
      await app.createStream(stream)
    }

    for (const moduleWrapper of this.modulesContainer.values()) {
      for (const providerWrapper of moduleWrapper.providers.values()) {
        await this.registerProvider(app, providerWrapper)
      }
    }

    return app
  }

  private async registerProvider (
    app: NatsApplication,
    providerWrapper: InstanceWrapper<unknown>
  ): Promise<void> {
    const providerClass = providerWrapper.metatype as ClassConstructor<unknown> | null
    const providerInstance = providerWrapper.instance as object

    if (providerClass == null) {
      return
    }

    if (!Object.hasOwn(providerClass, 'prototype')) {
      return
    }

    if (holdsNatsServiceEndpoints(providerClass)) {
      await app.addServiceEndpoints(providerClass, providerInstance)
    }

    if (isNatsMessageHandler(providerClass)) {
      await app.addSubscriberHandler(providerClass, providerInstance)
    }

    if (isJetstreamMessageHandler(providerClass)) {
      await app.addConsumerHandler(providerClass, providerInstance)
    }
  }
}
