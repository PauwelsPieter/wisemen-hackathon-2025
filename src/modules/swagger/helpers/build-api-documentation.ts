import { DocumentBuilder } from '@nestjs/swagger'
import { OpenApiDocument } from '../types/open-api-document.js'

export function buildApiDocumentation (): OpenApiDocument {
  return new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API documentation description')
    .setVersion('1.0')
    .addServer('http://localhost:3000')
    .addServer('https://example.development.appwi.se')
    .addServer('https://example.staging.appwi.se')
    .addServer('https://example.test.appwi.se')
    .addServer('https://example.production.appwi.se')
    .addOAuth2({
      type: 'openIdConnect',
      openIdConnectUrl: 'https://auth.example.appwi.se/.well-known/openid-configuration'
    })
    .build()
}
