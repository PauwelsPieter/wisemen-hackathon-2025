import { Module } from '@nestjs/common'
import { DomainEventLogSubscriberModule } from '../domain-event-log/use-cases/log-event/domain-event-log-subscriber.module.js'
import { AssignDefaultRoleToUserSubscriberModule } from '../../app/users/use-cases/assign-default-role-to-user/assign-default-role-to-user-subscriber.module.js'
import { ClearRolePermissionsCacheSubscriberModule } from '../../app/roles/use-cases/clear-role-permissions-cache/clear-role-permissions-cache-subscriber.module.js'
import { UserTypesenseSubscriberModule } from '../../app/users/typesense/user-typesense.subscriber.module.js'
import { CreateUserNotificationsSubscriberModule } from '../notification/use-cases/create-user-notifications/create-user-notifications.subscriber-module.js'
import { SendAppNotificationSubscriberModule } from '../notification/use-cases/send-app-notification/send-app-notification.subscriber.module.js'
import { ContactTypesenseSubscriberModule } from '../../app/contact/typesense/contact.typesense-subscriber.module.js'
import { AssignDefaultNotificationPreferencesToUserSubscriberModule } from '../notification/use-cases/assign-default-notification-preferences-to-user/assign-default-notification-preferences-to-user.subscriber.module.js'

@Module({
  imports: [
    DomainEventLogSubscriberModule,
    AssignDefaultRoleToUserSubscriberModule,
    ClearRolePermissionsCacheSubscriberModule,
    UserTypesenseSubscriberModule,
    CreateUserNotificationsSubscriberModule,
    SendAppNotificationSubscriberModule,
    ContactTypesenseSubscriberModule,
    AssignDefaultNotificationPreferencesToUserSubscriberModule
  ]
})
export class DomainEventSubscribersModule {}
