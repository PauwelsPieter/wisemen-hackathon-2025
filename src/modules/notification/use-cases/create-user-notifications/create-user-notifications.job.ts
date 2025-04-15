import { BaseJob, BaseJobData, PgBossJob } from '@wisemen/pgboss-nestjs-job'
import { QueueName } from '../../../pgboss/enums/queue-name.enum.js'

export interface CreateUserNotificationsJobData extends BaseJobData {
  notificationUuid: string
}

@PgBossJob(QueueName.SYSTEM)
export class CreateUserNotificationsJob extends BaseJob<CreateUserNotificationsJobData> {
  constructor (notificationUuid: string) {
    super({ notificationUuid })
  }
}
