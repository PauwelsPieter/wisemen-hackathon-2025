import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { transaction } from '@wisemen/nestjs-typeorm'
import { DomainEventEmitter } from '../../../domain-events/domain-event-emitter.js'
import { getSupportedNotificationChannels, isEnabledByDefaultForChannel } from '../../notification-types-config.js'
import { Notification } from '../../entities/notification.entity.js'
import { NotificationChannel } from '../../enums/notification-channel.enum.js'
import { UserNotification } from '../../entities/user-notification.entity.js'
import { UserNotificationEntityBuilder } from '../../entity-builders/user-notification.entity.builder.js'
import { CreateUserNotificationsRepository } from './create-user-notifications.repository.js'
import { SubscribedUser } from './subcribed-user.js'
import { UserNotificationCreatedEvent } from './user-notification.created.event.js'

@Injectable()
export class CreateUserNotificationsUseCase {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private readonly repository: CreateUserNotificationsRepository
  ) {}

  async execute (notificationUuid: string): Promise<void> {
    const notification = await this.repository.findNotificationOrFail(notificationUuid)
    const supportedChannels = getSupportedNotificationChannels(notification.type)
    for (const channel of supportedChannels) {
      await this.createUserNotifications(channel, notification)
    }
  }

  private async createUserNotifications (
    channel: NotificationChannel,
    notification: Notification
  ): Promise<void> {
    const includeUsersWithDefaultPreset = isEnabledByDefaultForChannel(notification.type, channel)
    const subscribedUserGenerator = this.repository.getSubscribedUsers({
      notification,
      channel,
      includeUsersWithDefaultPreset,
      batchSize: 500
    })

    for await (const users of subscribedUserGenerator) {
      const userNotifications = this.buildUserNotificationsForUsers(notification, channel, users)
      const events = userNotifications.map(n => new UserNotificationCreatedEvent(n))
      await transaction(this.dataSource, async () => {
        await this.repository.insertUserNotifications(userNotifications)
        await this.eventEmitter.emit(events)
      })
    }
  }

  private buildUserNotificationsForUsers (
    notification: Notification,
    channel: NotificationChannel,
    users: SubscribedUser[]
  ): UserNotification[] {
    const userNotifications: UserNotification[] = []
    for (const user of users) {
      const userNotification = new UserNotificationEntityBuilder()
        .withChannel(channel)
        .withNotificationUuid(notification.uuid)
        .withUserUuid(user.uuid)
        .withReadAt(null)
        .build()

      userNotifications.push(userNotification)
    }
    return userNotifications
  }
}
