import { Logger } from '@nestjs/common'
import { ServiceMsg } from '@nats-io/services'
import { jwtVerify } from 'jose'
import dayjs from 'dayjs'
import { NatsService } from '../../modules/nats/nats-service.decorator.js'
import { TokenContent } from '../../modules/auth/middleware/auth.middleware.js'
import { NatsServiceEndpoint } from '../../modules/nats/nats-service-endpoint.decorator.js'
import { WebappNatsClient } from './webapp.nats-client.js'
import { WebappAuthCalloutConfig as WebappAuthCalloutConfig } from './webapp-auth-callout.config.js'
import { NatsAuthorizationRequestParser } from './nats-authorization-request-parser.js'
import { NatsAuthorizationResponseBuilder } from './nats-authorization-response.js'

@NatsService({
  name: 'auth',
  version: '0.0.1',
  description: 'Handle authentication for zitadel jwts in chat applications',
  client: WebappNatsClient
})
export class WebappAuthCalloutNatsService {
  constructor (
    private readonly config: WebappAuthCalloutConfig,
    private readonly requestParser: NatsAuthorizationRequestParser
  ) {}

  @NatsServiceEndpoint({
    name: 'auth-callout',
    subject: '$SYS.REQ.USER.AUTH'
  })
  async handleCallout (msg: ServiceMsg): Promise<string> {
    const audience = this.config.natsAudience.orThrow()
    Logger.debug('received message', `${audience} Auth Callout`)

    const parsedRequest = this.requestParser.parse(msg)
    const { authToken, clientName } = parsedRequest
    Logger.debug(`authentication request from ${clientName}`, `${audience} Auth Callout`)

    const { payload } = await jwtVerify<TokenContent>(authToken, this.config.jwks.orThrow(), {
      issuer: this.config.tokenIssuer.orThrow(),
      audience: this.config.tokenAudience.orThrow()
    })

    Logger.debug('authenticated request for user ' + payload.sub, `${audience} Auth Callout`)

    return await new NatsAuthorizationResponseBuilder()
      .withAudience(this.config.natsAudience.orThrow())
      .withIssuerKeys(this.config.calloutIssuerKeys.orThrow())
      .withRequest(parsedRequest)
      .withUserName(payload.sub)
      .withPublishPermissions({ allow: ['test.' + payload.sub] })
      .withSubPermissions({ allow: ['test.' + payload.sub] })
      .withExpiresAt(dayjs().add(5, 'minutes').toDate())
      .build()
  }
}
