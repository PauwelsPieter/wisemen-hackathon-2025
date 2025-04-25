import { BaseJob, BaseJobData, PgBossJob } from '@wisemen/pgboss-nestjs-job'
import { QueueName } from '../../../pgboss/enums/queue-name.enum.js'
import { UserUuid } from '../../../../app/users/entities/user.uuid.js'

export interface AssignDefaultNotificationPreferencesToUserJobData extends BaseJobData {
  userUuid: UserUuid
}

@PgBossJob(QueueName.SYSTEM)
export class AssignDefaultNotificationPreferencesToUserJob
  extends BaseJob<AssignDefaultNotificationPreferencesToUserJobData> {
  constructor (userUuid: UserUuid) {
    super({ userUuid }, { singletonKey: `assign-default-notification-preferences-to-${userUuid}` })
  }
}
