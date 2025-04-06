import { Module } from '@nestjs/common'
import { UserModule } from '../../app/users/user.module.js'
import { RoleModule } from '../../app/roles/role.module.js'
import { NatsModule } from '../nats/nats.module.js'
import { WebsocketNatsGateway } from './websocket-nats.gateway.js'
import { WebsocketTopicValidator } from './websocket-topic.validator.js'

@Module({
  imports: [
    UserModule,
    RoleModule,
    NatsModule
  ],
  providers: [
    WebsocketNatsGateway,
    WebsocketTopicValidator
  ]
})
export class WebsocketModule {}
