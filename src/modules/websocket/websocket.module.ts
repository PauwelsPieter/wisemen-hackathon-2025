import { Module } from '@nestjs/common'
import { NatsClient } from '../nats/nats.client.js'
import { UserModule } from '../../app/users/user.module.js'
import { RoleModule } from '../../app/roles/role.module.js'
import { AuthMiddleware } from '../auth/middleware/auth.middleware.js'
import { WebsocketNatsGateway } from './websocket-nats.gateway.js'
import { WebsocketTopicValidator } from './websocket-topic.validator.js'

@Module({
  imports: [
    UserModule,
    RoleModule
  ],
  providers: [
    WebsocketNatsGateway,
    NatsClient,
    WebsocketTopicValidator,
    AuthMiddleware
  ]
})
export class WebsocketModule {}
