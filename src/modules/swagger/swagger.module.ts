import { INestApplication, Logger, Module } from '@nestjs/common'
import { SwaggerModule as NestSwaggerModule } from '@nestjs/swagger'
import { captureException } from '@sentry/nestjs'
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
    try {
      this.tryAddApiDocumentation(toApp, onRoute)
    } catch (e) {
      this.addFailurePage(onRoute, toApp, e)
    }
  }

  private static tryAddApiDocumentation (toApp: INestApplication<unknown>, onRoute: string) {
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
    try {
      this.tryAddWebSocketDocumentation(toApp, onRoute)
    } catch (e) {
      this.addFailurePage(onRoute, toApp, e)
    }
  }

  private static tryAddWebSocketDocumentation (toApp: INestApplication<unknown>, onRoute: string) {
    const documentation = buildWebSocketDocumentation()
    const document = NestSwaggerModule.createDocument(
      toApp, documentation, { include: [WSModule] })

    NestSwaggerModule.setup(onRoute, toApp, document)
  }

  private static addFailurePage (onRoute: string, toApp: INestApplication<unknown>, e) {
    captureException(e)
    Logger.error(e)
    NestSwaggerModule.setup(onRoute, toApp, {
      info: {
        title: 'Something went wrong',
        version: '',
        description: `An error occurred while generating the documentation:\n
        ${(e as { message?: string }).message ?? 'Unknown error'} `
      },
      openapi: '3.1.0',
      paths: {}
    }, {
      swaggerOptions: {
        tagsSorter: 'alpha',
        operationsSorter: 'alpha'
      }
    })
  }
}
