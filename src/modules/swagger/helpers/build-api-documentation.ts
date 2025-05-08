import { DocumentBuilder, getSchemaPath } from '@nestjs/swagger'
import { HttpStatus } from '@nestjs/common'
import { OpenApiDocument } from '../types/open-api-document.js'
import { InternalServerApiError } from '../../exceptions/api-errors/internal-server.api-error.js'
import { OpenIdConnectOptions } from '../types/open-id-connect-options.js'
import { EnvType } from '../../config/env.enum.js'
import { LOCAL_SERVER_URL } from '../swagger.constant.js'

export function buildApiDocumentation (options?: OpenIdConnectOptions): OpenApiDocument {
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

  addServers(builder)
  addAuthentication(builder, options)

  return builder.build()
}

function addServers (builder: DocumentBuilder) {
  const servers = process.env.OPEN_API_SERVERS?.split(',') ?? []

  const envType = process.env.NODE_ENV as EnvType

  if (envType === EnvType.LOCAL) {
    servers.unshift(LOCAL_SERVER_URL)
  } else {
    servers.push(LOCAL_SERVER_URL)
  }

  for (const server of servers) {
    builder.addServer(server)
  }
}

function addAuthentication (builder: DocumentBuilder, options?: OpenIdConnectOptions) {
  if (options == null) {
    return
  }

  const supportedScopes = options.scopes_supported ?? []
  const scopesObject: Record<string, string> = Object.fromEntries(
    supportedScopes.map(scope => [scope, scope])
  )

  const additionalScopeObjects = process.env.OPEN_API_SCOPES?.split(',') ?? []

  for (const scopeObject of additionalScopeObjects) {
    const [scope, description] = scopeObject.split(' ')

    if (scope == null) {
      continue
    }

    scopesObject[scope] = description ?? scope
  }

  builder.addOAuth2({
    type: 'oauth2',
    flows: {
      authorizationCode: {
        authorizationUrl: options.authorization_endpoint,
        tokenUrl: options.token_endpoint,
        refreshUrl: options.token_endpoint,
        scopes: scopesObject
      }
    }
  })
}
