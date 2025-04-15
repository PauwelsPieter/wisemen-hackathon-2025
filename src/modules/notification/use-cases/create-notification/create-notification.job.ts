import { BaseJob, BaseJobData, PgBossJob } from '@wisemen/pgboss-nestjs-job'
import { NotificationType } from '../../enums/notification-types.enum.js'
import { QueueName } from '../../../pgboss/enums/queue-name.enum.js'
import { Serializable } from '../../../../utils/types/serializable.js'

export interface CreateNotificationJobData extends BaseJobData {
  createdByUserUuid: string | null
  type: NotificationType
  meta: Serializable
}

@PgBossJob(QueueName.SYSTEM)
export class CreateNotificationJob extends BaseJob<CreateNotificationJobData> {
  constructor (notification: CreateNotificationJobData) {
    super(notification)
  }
}
