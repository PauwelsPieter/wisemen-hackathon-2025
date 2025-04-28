import { DynamicModule, Module, OnApplicationBootstrap, OnApplicationShutdown, Type } from '@nestjs/common'
import { ClassConstructor } from 'class-transformer'
import { ConfigModule } from '@nestjs/config'
import { AppModule } from '../../app.module.js'
import { NatsApplication } from './nats-application.js'
import { NatsApplicationFactory } from './nats-application-factory.js'

export interface NatsApplicationModuleOptions {
  modules: Type<unknown>[]
  defaultClient?: ClassConstructor<unknown>
}

@Module({})
export class NatsApplicationModule implements OnApplicationBootstrap, OnApplicationShutdown {
  static forRoot ({ modules, defaultClient }: NatsApplicationModuleOptions): DynamicModule {
    return {
      module: NatsApplicationModule,
      imports: [AppModule.forRoot(), ConfigModule, ...modules],
      providers: [{
        provide: 'DEFAULT_NATS_CLIENT',
        useValue: defaultClient
      }, NatsApplicationFactory]
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
