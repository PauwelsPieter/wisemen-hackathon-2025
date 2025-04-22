import { fromSeed, KeyPair } from '@nats-io/nkeys'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createRemoteJWKSet } from 'jose'
import { Optional } from '../../utils/optional/optional.js'

@Injectable()
export class WebappAuthCalloutConfig {
  private readonly _jwks: ReturnType<typeof createRemoteJWKSet> | undefined
  private readonly _issuer: KeyPair | undefined
  private readonly _audience: string | undefined
  private readonly _tokenIssuer: string | undefined
  private readonly _tokenAudience: string | undefined

  constructor (private readonly configService: ConfigService) {
    const jwksEndpoint = this.configService.get<string>('AUTH_JWKS_ENDPOINT')
    if (jwksEndpoint !== undefined) {
      this._jwks = createRemoteJWKSet(new URL(jwksEndpoint))
    }

    const nkey = this.configService.get<string>('WEBAPP_AUTH_CALLOUT_NKEY')
    if (nkey !== undefined) {
      this._issuer = fromSeed(new TextEncoder().encode(nkey))
    }

    this._audience = this.configService.get<string>('WEBAPP_NATS_AUDIENCE')
    this._tokenIssuer = this.configService.get<string>('AUTH_ISSUER')
    this._tokenAudience = this.configService.get<string>('AUTH_PROJECT_ID')
  }

  get jwks (): Optional<ReturnType<typeof createRemoteJWKSet>> {
    return new Optional(this._jwks)
  }

  get calloutIssuerKeys (): Optional<KeyPair> {
    return new Optional(this._issuer)
  }

  get natsAudience (): Optional<string> {
    return new Optional(this._audience)
  }

  get tokenIssuer (): Optional<string> {
    return new Optional(this._tokenIssuer)
  }

  get tokenAudience (): Optional<string> {
    return new Optional(this._tokenAudience)
  }
}
