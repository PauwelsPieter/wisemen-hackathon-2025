import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClassConstructor } from 'class-transformer'
import { ProvidersExplorer, NestjsProvider } from '../../../utils/providers/providers-explorer.js'
import { isNatsMessageHandler } from './subscribers/on-nats-message.decorator.js'
import { NatsApplication } from './nats-application.js'
import { holdsNatsServiceEndpoints } from './services/nats-service-endpoint.decorator.js'
import { isJetstreamMessageHandler } from './consumers/on-jetstream-message.decorator.js'

@Injectable()
export class NatsApplicationFactory {
  constructor (
    private readonly providerExplorer: ProvidersExplorer,
    private readonly configService: ConfigService,
    @Inject('DEFAULT_NATS_CLIENT') private readonly defaultClient?: ClassConstructor<unknown>,
    @Inject('NATS_STREAMS') private readonly streams?: ClassConstructor<unknown>[]
  ) {}

  async createApp (): Promise<NatsApplication> {
    const app = new NatsApplication(this.configService, this.defaultClient)

    for (const stream of this.streams ?? []) {
      await app.createStream(stream)
    }

    for (const provider of this.providerExplorer.providers) {
      await this.registerProvider(app, provider)
    }

    return app
  }

  private async registerProvider (
    app: NatsApplication,
    providerWrapper: NestjsProvider
  ): Promise<void> {
    if (holdsNatsServiceEndpoints(providerWrapper.providerClass)) {
      await app.addServiceEndpoints(
        providerWrapper.providerClass,
        providerWrapper.providerInstance
      )
    }

    if (isNatsMessageHandler(providerWrapper.providerClass)) {
      await app.addSubscriberHandler(
        providerWrapper.providerClass,
        providerWrapper.providerInstance
      )
    }

    if (isJetstreamMessageHandler(providerWrapper.providerClass)) {
      await app.addConsumerHandler(
        providerWrapper.providerClass,
        providerWrapper.providerInstance
      )
    }
  }
}
