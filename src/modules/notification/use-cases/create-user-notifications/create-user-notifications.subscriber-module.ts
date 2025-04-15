import { Module } from '@nestjs/common'
import { PgBossSchedulerModule } from '@wisemen/pgboss-nestjs-job'
import { CreateUserNotificationsSubscriber } from './create-user-notifications.subscriber.js'

@Module({
  imports: [PgBossSchedulerModule],
  providers: [CreateUserNotificationsSubscriber]
})
export class CreateUserNotificationsSubscriberModule {}
