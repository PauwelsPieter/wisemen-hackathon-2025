import { Injectable } from '@nestjs/common'
import { InjectRepository, transaction } from '@wisemen/nestjs-typeorm'
import { DataSource, IsNull, Repository } from 'typeorm'
import { UserNotification } from '../../entities/user-notification.entity.js'
import { DomainEventEmitter } from '../../../domain-events/domain-event-emitter.js'
import { NotificationChannel } from '../../enums/notification-channel.enum.js'
import { UserUuid } from '../../../../app/users/entities/user.uuid.js'
import { AllNotificationMarkedAsReadEvent } from './all-notifications-marked-as-read.event.js'

@Injectable()
export class MarkAllNotificationAsReadUseCase {
  constructor (
    private readonly dataSource: DataSource,
    @InjectRepository(UserNotification)
    private readonly repository: Repository<UserNotification>,
    private readonly eventEmitter: DomainEventEmitter
  ) {}

  async execute (userUuid: UserUuid): Promise<void> {
    await transaction(this.dataSource, async () => {
      await this.repository.update(
        { userUuid, channel: NotificationChannel.APP, readAt: IsNull() },
        { readAt: new Date() }
      )

      await this.eventEmitter.emitOne(new AllNotificationMarkedAsReadEvent(userUuid))
    })
  }
}
