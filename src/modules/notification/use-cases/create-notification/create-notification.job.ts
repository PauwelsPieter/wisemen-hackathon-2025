import { BaseJob, BaseJobData, PgBossJob } from '@wisemen/pgboss-nestjs-job'
import { NotificationType } from '../../enums/notification-types.enum.js'
import { QueueName } from '../../../pgboss/enums/queue-name.enum.js'
import { Serializable } from '../../../../utils/types/serializable.js'
import { UserUuid } from '../../../../app/users/entities/user.uuid.js'

export interface CreateNotificationJobData extends BaseJobData {
  createdByUserUuid: UserUuid | null
  type: NotificationType
  meta: Serializable
}

@PgBossJob(QueueName.SYSTEM)
export class CreateNotificationJob extends BaseJob<CreateNotificationJobData> {
  constructor (notification: CreateNotificationJobData) {
    super(notification)
  }
}
