import { startOpentelemetryTracing } from '../utils/opentelemetry/otel-tracer-sdk.js'
import { INestApplicationContext } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { WorkerContainer } from '@wisemen/app-container'
import { NatsApplicationModule } from '../modules/nats/nats-application/nats-application.module.js'
import { WebappAuthCalloutModule } from '../app/webapp-auth-callout/webapp-auth-callout.module.js'
import { ExampleNatsConsumerModule } from '../modules/nats/nats-application/examples/consumer/example-nats-consumer-module.js'
import { ExampleStream } from '../modules/nats/nats-application/examples/streams/example-stream.js'

startOpentelemetryTracing()

class NatsApp extends WorkerContainer {
  async bootstrap (): Promise<INestApplicationContext> {
    return await NestFactory.createApplicationContext(
      NatsApplicationModule.forRoot({
        modules: [WebappAuthCalloutModule, ExampleNatsConsumerModule],
        streams: [ExampleStream],
        defaultClient: undefined
      })
    )
  }
}

const _natsApp = new NatsApp()
