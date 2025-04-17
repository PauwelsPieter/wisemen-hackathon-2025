import { Injectable } from '@nestjs/common'
import { InjectRepository, transaction } from '@wisemen/nestjs-typeorm'
import { DataSource, Repository } from 'typeorm'
import { UserNotification } from '../../entities/user-notification.entity.js'
import { UserNotificationNotFoundError } from '../../errors/user-notification-not-found.error.js'
import { AuthContext } from '../../../auth/auth.context.js'
import { DomainEventEmitter } from '../../../domain-events/domain-event-emitter.js'
import { NotificationChannel } from '../../enums/notification-channel.enum.js'
import { NotificationUuid } from '../../entities/notification.uuid.js'
import { NotificationReadEvent } from './mark-notification-as-read.event.js'

@Injectable()
export class MarkNotificationAsReadUseCase {
  constructor (
    private readonly dataSource: DataSource,
    @InjectRepository(UserNotification)
    private readonly repository: Repository<UserNotification>,
    private readonly authContext: AuthContext,
    private readonly eventEmitter: DomainEventEmitter
  ) {}

  async execute (notificationUuid: NotificationUuid): Promise<void> {
    const userUuid = this.authContext.getUserUuidOrFail()

    const userNotificationExists = await this.repository.existsBy({
      notificationUuid,
      userUuid,
      channel: NotificationChannel.APP
    })

    if (!userNotificationExists) {
      throw new UserNotificationNotFoundError(notificationUuid)
    }

    await transaction(this.dataSource, async () => {
      await this.repository.update(
        { notificationUuid, userUuid, channel: NotificationChannel.APP },
        { readAt: new Date() }
      )

      await this.eventEmitter.emitOne(new NotificationReadEvent(notificationUuid, userUuid))
    })
  }
}
