import { SwaggerCustomOptions } from '@nestjs/swagger'
import { EnvType } from '../../../utils/envs/env.enum.js'

function buildRedirectUrl (): string {
  const path = 'api/oauth2-redirect'
  const envType = process.env.NODE_ENV as EnvType

  if (envType === EnvType.DEVELOPMENT) {
    return `https://example.development.appwi.se/${path}`
  } else if (envType === EnvType.STAGING) {
    return `https://example.staging.appwi.se/${path}`
  } else if (envType === EnvType.QA) {
    return `https://example.test.appwi.se/${path}`
  } else if (envType === EnvType.PRODUCTION) {
    return `https://example.production.appwi.se/${path}`
  } else {
    return `http://localhost:3000/${path}`
  }
}

function buildOAuthScopes (): Record<string, string> {
  return {
    openid: 'openid',
    email: 'email',
    profile: 'profile'
  }
}

export function buildExtraOptions (
  clientId?: string
): SwaggerCustomOptions {
  const scopes = buildOAuthScopes()
  const oauth2RedirectUrl = buildRedirectUrl()

  return {
    swaggerOptions: {
      tagsSorter: 'alpha',
      persistAuthorization: true,
      oauth2RedirectUrl: oauth2RedirectUrl,
      initOAuth: {
        clientId: clientId,
        scopes: Object.keys(scopes),
        usePkceWithAuthorizationCodeGrant: true
      }
    }
  }
}
