import { Injectable } from '@nestjs/common'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { NotificationCreatedEvent } from '../create-notification/notification-created.event.js'
import { Subscribe } from '../../../domain-events/subscribe.decorator.js'
import { CreateUserNotificationsJob } from './create-user-notifications.job.js'

@Injectable()
export class CreateUserNotificationsSubscriber {
  constructor (
    private readonly jobScheduler: PgBossScheduler
  ) {}

  @Subscribe(NotificationCreatedEvent)
  async on (events: NotificationCreatedEvent[]): Promise<void> {
    const jobs = events.map(event => new CreateUserNotificationsJob(event.content.uuid))
    await this.jobScheduler.scheduleJobs(jobs)
  }
}
