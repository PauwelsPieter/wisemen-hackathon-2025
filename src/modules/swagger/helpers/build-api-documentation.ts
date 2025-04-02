import { DocumentBuilder, getSchemaPath } from '@nestjs/swagger'
import { HttpStatus } from '@nestjs/common'
import { OpenApiDocument } from '../types/open-api-document.js'
import { EnvType } from '../../config/env.enum.js'
import { InternalServerApiError } from '../../exceptions/api-errors/internal-server.api-error.js'
import { buildBaseUrl } from './build-base-url.js'

export function buildApiDocumentation (): OpenApiDocument {
  const builder = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API documentation description')
    .setVersion('1.0')
    .addGlobalResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      schema: {
        properties: {
          traceId: { type: 'string', nullable: true },
          errors: {
            type: 'array',
            items: {
              oneOf: [
                { $ref: getSchemaPath(InternalServerApiError) }
              ]
            }
          }
        }
      }
    })

  const environments = Object.values(EnvType)
  const currentEnv = process.env.NODE_ENV

  const currentEnvironmentIndex = environments.findIndex(environment => environment === currentEnv)

  environments.unshift(...environments.splice(currentEnvironmentIndex, 1))

  for (const environment of environments) {
    builder.addServer(buildBaseUrl(environment))
  }

  const openIdConnectUrl = process.env.SWAGGER_OPENID_CONNECT_URL

  if (openIdConnectUrl !== undefined) {
    builder.addOAuth2({
      type: 'openIdConnect',
      openIdConnectUrl: openIdConnectUrl
    })
  }

  return builder.build()
}
