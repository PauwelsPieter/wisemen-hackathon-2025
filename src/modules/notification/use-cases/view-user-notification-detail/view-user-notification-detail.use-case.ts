import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { NotificationUuid } from '../../entities/notification.uuid.js'
import { NotificationResponse } from '../../notification.response.js'
import { AuthContext } from '../../../auth/auth.context.js'
import { UserNotification } from '../../entities/user-notification.entity.js'
import { NotificationChannel } from '../../enums/notification-channel.enum.js'
import { UserNotificationNotFoundError } from '../../errors/user-notification-not-found.error.js'

@Injectable()
export class ViewUserNotificationDetailUseCase {
  constructor (
    private readonly authContext: AuthContext,
    @InjectRepository(UserNotification)
    private readonly repository: Repository<UserNotification>
  ) {}

  async execute (notificationUuid: NotificationUuid): Promise<NotificationResponse> {
    const userUuid = this.authContext.getUserUuidOrFail()

    const notification = await this.repository.findOne({
      where: { userUuid, notificationUuid, channel: NotificationChannel.APP },
      relations: { notification: { createdByUser: true } }
    })

    if (notification === null) {
      throw new UserNotificationNotFoundError(notificationUuid)
    }

    return new NotificationResponse(notification)
  }
}
