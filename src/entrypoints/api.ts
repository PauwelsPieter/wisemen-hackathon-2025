import '../modules/exceptions/sentry.js'
import { startOpentelemetryTracing } from '../utils/opentelemetry/otel-tracer-sdk.js'
import { NestFactory } from '@nestjs/core'
import { INestApplicationContext, VersioningType } from '@nestjs/common'
import { ExpressAdapter } from '@nestjs/platform-express'
import { ApiContainer } from '@wisemen/app-container'
import { SwaggerModule } from '../modules/swagger/swagger.module.js'
import { ApiModule } from '../modules/api/api.module.js'

startOpentelemetryTracing()

class Api extends ApiContainer {
  async bootstrap (adapter: ExpressAdapter): Promise<INestApplicationContext> {
    const app = await NestFactory.create(ApiModule, adapter)

    app.setGlobalPrefix('api', {
      exclude: []
    })
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1'
    })
    app.enableCors({
      exposedHeaders: ['Content-Disposition']
    })

    SwaggerModule.addDocumentation(app)

    return app
  }
}

const _api = new Api()
