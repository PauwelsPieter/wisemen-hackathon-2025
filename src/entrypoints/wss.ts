import '../modules/exceptions/sentry.js'

import { NestFactory } from '@nestjs/core'
import { INestApplicationContext, Module } from '@nestjs/common'
import { ExpressAdapter } from '@nestjs/platform-express'
import { ApiContainer } from '@wisemen/app-container'
import { AppModule } from '../app.module.js'
import { WSModule } from '../modules/websocket/ws.module.js'
import { AuthenticatedWsAdapter } from '../modules/websocket/ws-adapter.js'
import { AuthModule } from '../modules/auth/auth.module.js'
import { startTracers } from '../utils/opentelemetry/tracer.js'

@Module({
  imports: [
    AppModule.forRoot(),
    AuthModule,
    WSModule.register()
  ]
})
class WssModule {}

class WebsocketServer extends ApiContainer {
  async bootstrap (adapter: ExpressAdapter): Promise<INestApplicationContext> {
    startTracers('websocket')

    const httpServer = adapter.getHttpServer()

    const app = await NestFactory.create(WssModule, adapter)

    adapter.setHttpServer(httpServer)

    app.useWebSocketAdapter(new AuthenticatedWsAdapter(app))

    return app
  }
}

const _websocketServer = new WebsocketServer()
