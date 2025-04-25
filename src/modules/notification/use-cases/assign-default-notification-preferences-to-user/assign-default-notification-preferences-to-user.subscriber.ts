import { Injectable } from '@nestjs/common'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { UserCreatedEvent } from '../../../../app/users/use-cases/get-or-create-user/user-created.event.js'
import { Subscribe } from '../../../domain-events/subscribe.decorator.js'
import { AssignDefaultNotificationPreferencesToUserJob } from './assign-default-notification-preferences-to-user.job.js'

@Injectable()
export class AssignDefaultNotificationPreferencesToUserSubscriber {
  constructor (
    private readonly jobScheduler: PgBossScheduler
  ) {}

  @Subscribe(UserCreatedEvent)
  async run (events: UserCreatedEvent[]): Promise<void> {
    const jobs = events.map(event =>
      new AssignDefaultNotificationPreferencesToUserJob(event.content.userUuid)
    )

    await this.jobScheduler.scheduleJobs(jobs)
  }
}
