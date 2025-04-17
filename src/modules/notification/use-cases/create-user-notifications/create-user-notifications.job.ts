import { BaseJob, BaseJobData, PgBossJob } from '@wisemen/pgboss-nestjs-job'
import { QueueName } from '../../../pgboss/enums/queue-name.enum.js'
import { NotificationUuid } from '../../entities/notification.uuid.js'

export interface CreateUserNotificationsJobData extends BaseJobData {
  notificationUuid: NotificationUuid
}

@PgBossJob(QueueName.SYSTEM)
export class CreateUserNotificationsJob extends BaseJob<CreateUserNotificationsJobData> {
  constructor (notificationUuid: NotificationUuid) {
    super({ notificationUuid })
  }
}
