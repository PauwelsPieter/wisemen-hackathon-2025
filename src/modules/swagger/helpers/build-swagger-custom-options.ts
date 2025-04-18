import { SwaggerCustomOptions } from '@nestjs/swagger'
import { EnvType } from '../../config/env.enum.js'
import { buildBaseUrl } from './build-base-url.js'

function buildRedirectUrl (): string {
  const path = 'api/oauth2-redirect'
  const envType = process.env.NODE_ENV as EnvType

  const baseUrl = buildBaseUrl(envType)

  return `${baseUrl}/${path}`
}

function buildOAuthScopes (): Record<string, string> {
  return {
    openid: 'openid',
    email: 'email',
    profile: 'profile',
    offline_access: 'offline_access'
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
        usePkceWithAuthorizationCodeGrant: true,
        additionalQueryStringParams: {
          prompt: 'select_account'
        }
      }
    }
  }
}
