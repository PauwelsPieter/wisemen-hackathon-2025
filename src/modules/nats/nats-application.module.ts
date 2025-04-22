import { DynamicModule, Inject, Module, OnApplicationBootstrap, Type } from '@nestjs/common'
import { ModulesContainer } from '@nestjs/core'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper.js'
import { ClassConstructor } from 'class-transformer'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppModule } from '../../app.module.js'
import { NatsApplication } from './nats-application.js'
import { isNatsService } from './nats-service.decorator.js'

export interface NatsApplicationModuleOptions {
  modules: Type<unknown>[]
  defaultClient?: ClassConstructor<unknown>
}

@Module({})
export class NatsApplicationModule implements OnApplicationBootstrap {
  static forRoot ({ modules, defaultClient }: NatsApplicationModuleOptions): DynamicModule {
    return {
      module: NatsApplicationModule,
      imports: [AppModule, ConfigModule, ...modules],
      providers: [{
        provide: 'DEFAULT_NATS_CLIENT',
        useValue: defaultClient
      }]
    }
  }

  private readonly application: NatsApplication
  constructor (
    private readonly modulesContainer: ModulesContainer,
    private readonly configService: ConfigService,
    @Inject('DEFAULT_NATS_CLIENT') defaultClient: ClassConstructor<unknown> | undefined
  ) {
    this.application = new NatsApplication(configService, defaultClient)
  }

  async onApplicationBootstrap (): Promise<void> {
    for (const moduleWrapper of this.modulesContainer.values()) {
      for (const providerWrapper of moduleWrapper.providers.values()) {
        await this.registerProvider(providerWrapper)
      }
    }
  }

  private async registerProvider (providerWrapper: InstanceWrapper<unknown>): Promise<void> {
    const providerClass = providerWrapper.metatype

    if (providerClass == null) {
      return
    }

    if (!Object.hasOwn(providerClass, 'prototype')) {
      return
    }

    if (isNatsService(providerClass as Type<unknown>)) {
      await this.application.addService(
        providerClass as ClassConstructor<unknown>,
        providerWrapper.instance as object
      )
    }
  }
}
