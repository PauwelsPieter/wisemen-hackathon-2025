import { Module } from '@nestjs/common'
import { EventLogSubscriberModule } from '../event-log/use-cases/log-event/event-log-subscriber.module.js'
import { AssignDefaultRoleToUserSubscriberModule } from '../../app/users/use-cases/assign-default-role-to-user/assign-default-role-to-user-subscriber.module.js'
import { NatsOutboxSubscriberModule } from '../nats/outbox/nats-outbox.subscriber.module.js'
import { ClearRolePermissionsCacheSubscriberModule } from '../../app/roles/use-cases/clear-role-permissions-cache/clear-role-permissions-cache-subscriber.module.js'
import { UserTypesenseSubscriberModule } from '../../app/users/typesense/user-typesense.subscriber.module.js'

@Module({
  imports: [
    EventLogSubscriberModule,
    AssignDefaultRoleToUserSubscriberModule,
    NatsOutboxSubscriberModule,
    ClearRolePermissionsCacheSubscriberModule,
    UserTypesenseSubscriberModule
  ]
})
export class EventSubscribersModule {}
