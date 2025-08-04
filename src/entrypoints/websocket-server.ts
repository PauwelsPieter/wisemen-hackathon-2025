import '../modules/exceptions/sentry.js'
import { startOpentelemetryTracing } from '../utils/opentelemetry/otel-tracer-sdk.js'
import { NestFactory } from '@nestjs/core'
import { INestApplicationContext, Module } from '@nestjs/common'
import { ExpressAdapter } from '@nestjs/platform-express'
import { ApiContainer } from '@wisemen/app-container'
import { AppModule } from '../app.module.js'
import { WebsocketModule } from '../modules/websocket/websocket.module.js'
import { AuthenticatedWsAdapter } from '../modules/websocket/websocket-adapter.js'

@Module({
  imports: [
    AppModule.forRoot(),
    WebsocketModule
  ]
})
class WebsocketServerModule {}

startOpentelemetryTracing()

class WebsocketServer extends ApiContainer {
  async bootstrap (adapter: ExpressAdapter): Promise<INestApplicationContext> {
    const httpServer = adapter.getHttpServer()

    const app = await NestFactory.create(WebsocketServerModule, adapter)

    adapter.setHttpServer(httpServer)

    app.useWebSocketAdapter(new AuthenticatedWsAdapter(app))

    return app
  }
}

const _websocketServer = new WebsocketServer()
