import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { AuthContext } from '../../../auth/auth.context.js'
import { UserNotification } from '../../entities/user-notification.entity.js'
import { NotificationChannel } from '../../enums/notification-channel.enum.js'
import { ViewUnreadNotificationsCountResponse } from './view-unread-notifications-count.response.js'
import { MAX_UNREAD_NOTIFICATIONS_COUNT } from './constants.js'

@Injectable()
export class ViewUnreadNotificationsCountUseCase {
  constructor (
    private readonly authContext: AuthContext,
    @InjectRepository(UserNotification)
    private readonly userNotificationRepo: Repository<UserNotification>
  ) {}

  async execute (): Promise<ViewUnreadNotificationsCountResponse> {
    const userUuid = this.authContext.getUserUuidOrFail()

    const { amount: rawAmount } = await this.userNotificationRepo.createQueryBuilder('notification')
      .select('COUNT(*) AS "amount"')
      .where('notification.userUuid = :userUuid', { userUuid })
      .andWhere('notification.channel = :channel', { channel: NotificationChannel.APP })
      .andWhere('notification.readAt IS NULL')
      .limit(MAX_UNREAD_NOTIFICATIONS_COUNT + 1)
      .getRawOne<{ amount: string }>() ?? { amount: 0 }

    const exceedsLimit = Number(rawAmount) > MAX_UNREAD_NOTIFICATIONS_COUNT
    const amount = exceedsLimit ? MAX_UNREAD_NOTIFICATIONS_COUNT : Number(rawAmount)

    return new ViewUnreadNotificationsCountResponse(amount, exceedsLimit)
  }
}
