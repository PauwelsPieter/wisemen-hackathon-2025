import { INestApplication, Module } from '@nestjs/common'
import { SwaggerModule as NestSwaggerModule } from '@nestjs/swagger'
import { WSModule } from '../websocket/ws.module.js'
import { buildWebSocketDocumentation } from './helpers/build-websocket-documentation.js'
import { SwaggerController } from './swagger.controller.js'
import { buildApiDocumentation } from './helpers/build-api-documentation.js'
import { buildExtraOptions } from './helpers/build-swagger-custom-options.js'

@Module({
  controllers: [
    SwaggerController
  ]
})
export class SwaggerModule {
  static addDocumentation (app: INestApplication) {
    this.addApiDocumentation(app, 'api/docs')
    this.addWebSocketDocumentation(app, 'api/docs/websockets')
  }

  private static addApiDocumentation (toApp: INestApplication<unknown>, onRoute: string): void {
    const clientId = process.env.ZITADEL_CLIENT_ID

    const documentation = buildApiDocumentation()
    const document = NestSwaggerModule.createDocument(toApp, documentation)
    const customOptions = buildExtraOptions(clientId)

    NestSwaggerModule.setup(onRoute, toApp, document, customOptions)
  }

  private static addWebSocketDocumentation (
    toApp: INestApplication<unknown>,
    onRoute: string
  ): void {
    const documentation = buildWebSocketDocumentation()
    const document = NestSwaggerModule.createDocument(
      toApp, documentation, { include: [WSModule] })

    NestSwaggerModule.setup(onRoute, toApp, document)
  }
}
