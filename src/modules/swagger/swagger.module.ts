import { INestApplication, Logger, Module } from '@nestjs/common'
import { SwaggerModule as NestSwaggerModule } from '@nestjs/swagger'
import { captureException } from '@sentry/nestjs'
import axios from 'axios'
import { WebsocketModule } from '../websocket/websocket.module.js'
import { InternalServerApiError } from '../exceptions/api-errors/internal-server.api-error.js'
import { buildWebSocketDocumentation } from './helpers/build-websocket-documentation.js'
import { SwaggerController } from './swagger.controller.js'
import { buildApiDocumentation } from './helpers/build-api-documentation.js'
import { buildSwaggerCustomOptions } from './helpers/build-custom-options.js'
import { createSwaggerOperationId } from './helpers/create-swagger-operation-id.js'
import { buildErrorDocumentation } from './helpers/build-error-documentation.js'
import { OpenIdConnectOptions } from './types/open-id-connect-options.js'

@Module({
  controllers: [SwaggerController]
})
export class SwaggerModule {
  static async addDocumentation (app: INestApplication): Promise<void> {
    await this.addApiDocumentation(app, 'api/docs')

    this.addWebSocketDocumentation(app, 'api/docs/websockets')
  }

  private static async addApiDocumentation (
    toApp: INestApplication<unknown>,
    onRoute: string
  ): Promise<void> {
    try {
      await this.tryAddApiDocumentation(toApp, onRoute)
    } catch (e) {
      this.addFailurePage(onRoute, toApp, e)
    }
  }

  private static async tryAddApiDocumentation (
    toApp: INestApplication<unknown>,
    onRoute: string
  ): Promise<void> {
    const openIdConnectOptions = await this.loadOpenIdConnectOptions()
    const defaultScopes = openIdConnectOptions?.scopes_supported ?? []

    const customOptions = buildSwaggerCustomOptions(defaultScopes)
    const documentation = buildApiDocumentation(openIdConnectOptions)

    const document = NestSwaggerModule.createDocument(toApp, documentation, {
      operationIdFactory: createSwaggerOperationId,
      extraModels: [InternalServerApiError]
    })

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
      toApp, documentation, { include: [WebsocketModule] })

    NestSwaggerModule.setup(onRoute, toApp, document)
  }

  private static addFailurePage (onRoute: string, toApp: INestApplication<unknown>, e) {
    captureException(e)
    Logger.error(e)

    const document = buildErrorDocumentation(e)

    NestSwaggerModule.setup(onRoute, toApp, document)
  }

  private static async loadOpenIdConnectOptions (): Promise<OpenIdConnectOptions | undefined> {
    const openIdConnectUrl = process.env.OPEN_API_OPENID_CONFIGURATION_URL

    if (openIdConnectUrl == null) {
      return undefined
    }

    const client = axios.create({
      timeout: 5_000
    })

    try {
      const response = await client.get<OpenIdConnectOptions>(openIdConnectUrl)
      return response.data
    } catch (error) {
      captureException(error)
      Logger.error('Failed to load OpenID Connect options', error)

      return undefined
    }
  }
}
