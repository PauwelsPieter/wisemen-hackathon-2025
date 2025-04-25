import { Module } from '@nestjs/common'
import { PgBossSchedulerModule } from '@wisemen/pgboss-nestjs-job'
import { AssignDefaultNotificationPreferencesToUserSubscriber } from './assign-default-notification-preferences-to-user.subscriber.js'

@Module({
  imports: [PgBossSchedulerModule],
  providers: [AssignDefaultNotificationPreferencesToUserSubscriber]
})
export class AssignDefaultNotificationPreferencesToUserSubscriberModule {}
