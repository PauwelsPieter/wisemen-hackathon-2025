import { DocumentBuilder } from '@nestjs/swagger'
import { OpenApiDocument } from '../types/open-api-document.js'
import { EnvType } from '../../config/env.enum.js'
import { buildBaseUrl } from './build-base-url.js'

export function buildApiDocumentation (): OpenApiDocument {
  const builder = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API documentation description')
    .setVersion('1.0')

  const environments = Object.values(EnvType)

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
