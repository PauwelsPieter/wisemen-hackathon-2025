import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { User } from '../users/entities/user.entity.js'
import { WebappAuthCalloutNatsService } from './webapp-auth-callout.nats-service.js'
import { WebappAuthCalloutConfig } from './webapp-auth-callout.config.js'
import { NatsAuthorizationRequestParser } from './nats-authorization-request-parser.js'
import { WebappNatsPermissions } from './webapp-nats-permissions.js'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User])
  ],
  providers: [
    WebappAuthCalloutNatsService,
    WebappAuthCalloutConfig,
    NatsAuthorizationRequestParser,
    WebappNatsPermissions
  ]
})
export class WebappAuthCalloutModule {}
