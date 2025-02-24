import '../modules/exceptions/sentry.js'
import { startOpentelemetry } from '../utils/opentelemetry/otel-sdk.js'
import { NestFactory } from '@nestjs/core'
import { INestApplicationContext, Module } from '@nestjs/common'
import { ExpressAdapter } from '@nestjs/platform-express'
import { ApiContainer } from '@wisemen/app-container'
import { AppModule } from '../app.module.js'
import { WebsocketModule } from '../modules/websocket/websocket.module.js'
import { AuthenticatedWsAdapter } from '../modules/websocket/websocket-adapter.js'
import { AuthModule } from '../modules/auth/auth.module.js'

@Module({
  imports: [
    AppModule.forRoot(),
    AuthModule,
    WebsocketModule
  ]
})
class WebsocketServerModule {}

startOpentelemetry()

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
