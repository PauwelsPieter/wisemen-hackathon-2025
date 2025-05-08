import { SwaggerCustomOptions } from '@nestjs/swagger'
import { EnvType } from '../../config/env.enum.js'
import { LOCAL_SERVER_URL } from '../swagger.constant.js'

function buildSwaggerRedirectUrl (): string | undefined {
  const path = 'api/oauth2-redirect'
  const envType = process.env.NODE_ENV as EnvType

  if (envType === EnvType.LOCAL) {
    return `${LOCAL_SERVER_URL}/${path}`
  } else {
    const servers = process.env.OPEN_API_SERVERS?.split(',')
    const server = servers?.at(0)

    if (server == null) {
      return undefined
    } else {
      return `${server}/${path}`
    }
  }
}

export function buildSwaggerCustomOptions (defaultScopes: string[]): SwaggerCustomOptions {
  return {
    swaggerOptions: {
      tagsSorter: 'alpha',
      persistAuthorization: true,
      oauth2RedirectUrl: buildSwaggerRedirectUrl(),
      initOAuth: {
        scopes: defaultScopes,
        usePkceWithAuthorizationCodeGrant: true,
        additionalQueryStringParams: {
          prompt: 'login'
        }
      }
    }
  }
}
