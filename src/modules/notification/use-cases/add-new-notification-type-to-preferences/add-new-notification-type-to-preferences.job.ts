import { BaseJob, BaseJobData, PgBossJob } from '@wisemen/pgboss-nestjs-job'
import { NotificationType } from '../../enums/notification-types.enum.js'
import { QueueName } from '../../../pgboss/enums/queue-name.enum.js'

export interface AddNewNotificationTypeToPreferencesJobData extends BaseJobData {
  type: NotificationType
  isNewCategory: boolean
}

@PgBossJob(QueueName.SYSTEM)
export class AddNewNotificationTypeToPreferencesJob
  extends BaseJob<AddNewNotificationTypeToPreferencesJobData> {
  constructor (type: NotificationType, isNewCategory: boolean) {
    super({ type, isNewCategory })
  }
}
