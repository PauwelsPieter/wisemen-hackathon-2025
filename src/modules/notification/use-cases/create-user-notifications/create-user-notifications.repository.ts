import { Injectable } from '@nestjs/common'
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Notification } from '../../entities/notification.entity.js'
import { UserNotification } from '../../entities/user-notification.entity.js'
import { NotificationPreferencesPreset } from '../../entities/notification-preferences-preset.entity.js'
import { NotificationChannel } from '../../enums/notification-channel.enum.js'
import { NotificationPreset } from '../../enums/notification-preset.enum.js'
import { SubscribedUser } from './subcribed-user.js'

@Injectable()
export class CreateUserNotificationsRepository {
  constructor (
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(UserNotification)
    private readonly userNotificationRepo: Repository<UserNotification>,
    @InjectRepository(NotificationPreferencesPreset)
    private readonly preferenceRepo: Repository<NotificationPreferencesPreset>
  ) {}

  async findNotificationOrFail (notificationUuid: string): Promise<Notification> {
    return await this.notificationRepo.findOneByOrFail({ uuid: notificationUuid })
  }

  async insertUserNotifications (notifications: UserNotification[]): Promise<void> {
    await this.userNotificationRepo.insert(notifications)
  }

  async* getSubscribedUsers ({ notification, channel, includeUsersWithDefaultPreset, batchSize }: {
    notification: Notification
    channel: NotificationChannel
    includeUsersWithDefaultPreset: boolean
    batchSize: number
  }): AsyncGenerator<SubscribedUser[]> {
    const presets = includeUsersWithDefaultPreset
      ? [NotificationPreset.ALL, NotificationPreset.DEFAULT]
      : [NotificationPreset.ALL]

    let key: string | undefined = undefined

    do {
      const query = this.preferenceRepo.createQueryBuilder('npp')
        .select('npp.user_uuid AS "uuid"')
        .where((qb) => {
          // Filter out users who already received the notification
          const subQuery = qb.subQuery()
            .select('user_notification.user_uuid')
            .from('user_notification', 'user_notification')
            .where('user_notification.notification_uuid = :notificationUuid')
            .andWhere('user_notification.channel = :userNotificationChannel')
            .getQuery()

          return 'npp.user_uuid NOT IN ' + subQuery
        })
        .andWhere(new Brackets((qb) => {
          // Find all users with set preset or with custom preset and enabled notification
          qb.where('npp.preset IN (:...presets)')
            .orWhere(new Brackets((qb) => {
              qb.where('npp.preset = :customPreset')
                .andWhere((qb: SelectQueryBuilder<NotificationPreferencesPreset>) => {
                  const subQuery = qb.subQuery()
                    .select('np.user_uuid')
                    .from('notification_preferences', 'np')
                    .where('np.is_enabled = TRUE')
                    .andWhere('np.types @> :types::notification_preferences_types_enum[]')
                    .andWhere('np.channel = :notificationPreferenceChannel')
                    .getQuery()

                  return 'npp.user_uuid IN ' + subQuery
                })
            }))
        }))
        .setParameters({
          notificationPreferenceChannel: channel,
          userNotificationChannel: channel,
          types: [notification.type],
          notificationUuid: notification.uuid,
          customPreset: NotificationPreset.CUSTOM,
          presets
        })
        .orderBy('npp.user_uuid', 'ASC')
        .take(batchSize)

      if (notification.createdByUserUuid !== null) {
        query.andWhere('npp.user_uuid != :userUuid', { userUuid: notification.createdByUserUuid })
      }

      if (key !== undefined) {
        query.andWhere('npp.user_uuid > :key', { key })
      }

      const users = await query.getRawMany<SubscribedUser>()

      if (users.length === 0) {
        return
      }

      yield users
      key = users.at(-1)?.uuid
    } while (key !== undefined)
  }
}
