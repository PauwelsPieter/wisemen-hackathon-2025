import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { transaction } from '@wisemen/nestjs-typeorm'
import { DomainEventEmitter } from '../../../domain-events/domain-event-emitter.js'
import { CreateNotificationJob } from '../create-notification/create-notification.job.js'
import { NotificationType } from '../../enums/notification-types.enum.js'
import { UserUuid } from '../../../../app/users/entities/user.uuid.js'
import { SendTestNotificationCommand } from './send-test-notification.command.js'
import { TestNotificationSentEvent } from './test-notification-sent.event.js'
import { TestNotificationContent } from './test-notification.js'

@Injectable()
export class SendTestNotificationUseCase {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private readonly jobScheduler: PgBossScheduler
  ) {}

  async execute (
    command: SendTestNotificationCommand,
    createdByUserUuid: UserUuid
  ): Promise<void> {
    await transaction(this.dataSource, async () => {
      await this.jobScheduler.scheduleJob(new CreateNotificationJob({
        createdByUserUuid: createdByUserUuid,
        meta: new TestNotificationContent(command.message).serialize(),
        type: NotificationType.TEST_NOTIFICATION
      }))
      await this.eventEmitter.emitOne(new TestNotificationSentEvent(command.message))
    })
  }
}
