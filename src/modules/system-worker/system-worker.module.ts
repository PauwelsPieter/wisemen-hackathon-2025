import { DynamicModule, Module } from '@nestjs/common'
import { AppModule } from '../../app.module.js'
import { PublishNatsEventJobModule } from '../nats/outbox/publish-nats-event/publish-nats-event.module.js'
import { ImportTypesenseJobModule } from '../typesense/jobs/import-typesense/import-typesense.module.js'
import { SyncTypesenseJobModule } from '../typesense/jobs/sync-typesense/sync-typesense-job.module.js'
import { AssignDefaultNotificationPreferencesToUserJobModule } from '../notification/use-cases/assign-default-notification-preferences-to-user/assign-default-notification-preferences-to-user.job.module.js'
import { CreateNotificationJobModule } from '../notification/use-cases/create-notification/create-notification.job.module.js'
import { CreateUserNotificationsJobModule } from '../notification/use-cases/create-user-notifications/create-user-notifications.job-module.js'
import { AddNewNotificationTypeToPreferencesJobModule } from '../notification/use-cases/add-new-notification-type-to-preferences/add-new-notification-type-to-preferences.job.module.js'

@Module({})
export class SystemWorkerModule {
  static forRoot (modules: DynamicModule[]): DynamicModule {
    return {
      module: SystemWorkerModule,
      imports: [
        AppModule.forRoot(modules),
        PublishNatsEventJobModule,
        ImportTypesenseJobModule,
        SyncTypesenseJobModule,
        CreateNotificationJobModule,
        CreateUserNotificationsJobModule,
        AddNewNotificationTypeToPreferencesJobModule,
        AssignDefaultNotificationPreferencesToUserJobModule
      ]
    }
  }
}
