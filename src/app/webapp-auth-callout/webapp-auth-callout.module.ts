import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { WebappAuthCalloutNatsService } from './webapp-auth-callout.nats-service.js'
import { WebappAuthCalloutConfig } from './webapp-auth-callout.config.js'
import { NatsAuthorizationRequestParser } from './nats-authorization-request-parser.js'

@Module({
  imports: [ConfigModule],
  providers: [
    WebappAuthCalloutNatsService,
    WebappAuthCalloutConfig,
    NatsAuthorizationRequestParser
  ]
})
export class WebappAuthCalloutModule {}
