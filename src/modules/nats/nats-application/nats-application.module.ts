import { DynamicModule, Module, OnApplicationBootstrap, OnApplicationShutdown, Type } from '@nestjs/common'
import { ClassConstructor } from 'class-transformer'
import { ConfigModule } from '@nestjs/config'
import { AppModule } from '../../../app.module.js'
import { ProvidersExplorerModule } from '../../../utils/providers/providers-explorer.module.js'
import { NatsApplication } from './nats-application.js'
import { NatsApplicationFactory } from './nats-application-factory.js'

export interface NatsApplicationModuleOptions {
  modules: Type<unknown>[]
  /** Creates the streams at startup */
  streams?: Array<ClassConstructor<unknown>>
  defaultClient?: ClassConstructor<unknown>
}

@Module({})
export class NatsApplicationModule implements OnApplicationBootstrap, OnApplicationShutdown {
  static forRoot (
    { modules, defaultClient, streams }: NatsApplicationModuleOptions
  ): DynamicModule {
    return {
      module: NatsApplicationModule,
      imports: [
        AppModule.forRoot(),
        ConfigModule,
        ProvidersExplorerModule,
        ...modules
      ],
      providers: [
        {
          provide: 'DEFAULT_NATS_CLIENT',
          useValue: defaultClient
        },
        {
          provide: 'NATS_STREAMS',
          useValue: streams
        },
        NatsApplicationFactory
      ]
    }
  }

  private application: NatsApplication

  constructor (
    private readonly appFactory: NatsApplicationFactory
  ) {}

  async onApplicationBootstrap (): Promise<void> {
    this.application = await this.appFactory.createApp()
    this.application.listen()
  }

  async onApplicationShutdown (): Promise<void> {
    await this.application.close()
  }
}
