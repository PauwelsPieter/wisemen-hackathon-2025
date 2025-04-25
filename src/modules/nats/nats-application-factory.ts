import { Inject, Injectable, Type } from '@nestjs/common'
import { ModulesContainer } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ClassConstructor } from 'class-transformer'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper.js'
import { NatsApplication } from './nats-application.js'
import { holdsNatsServiceEndpoints } from './nats-service-endpoint.decorator.js'
import { isNatsMessageHandler } from './on-nats-event.decorator.js'

@Injectable()
export class NatsApplicationFactory {
  constructor (
    private readonly modulesContainer: ModulesContainer,
    private readonly configService: ConfigService,
    @Inject('DEFAULT_NATS_CLIENT') private readonly defaultClient?: ClassConstructor<unknown>
  ) {}

  async createApp (): Promise<NatsApplication> {
    const app = new NatsApplication(this.configService, this.defaultClient)

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
    const providerClass = providerWrapper.metatype

    if (providerClass == null) {
      return
    }

    if (!Object.hasOwn(providerClass, 'prototype')) {
      return
    }

    if (holdsNatsServiceEndpoints(providerClass as Type<unknown>)) {
      await app.addServiceEndpoints(
        providerClass as ClassConstructor<unknown>,
        providerWrapper.instance as object
      )
    }

    if (isNatsMessageHandler(providerClass as Type<unknown>)) {
      await app.addMessageHandler(
        providerClass as ClassConstructor<unknown>,
        providerWrapper.instance as object
      )
    }
  }
}
