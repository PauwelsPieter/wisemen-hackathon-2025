import { NotificationChannel } from '../enums/notification-channel.enum.js'
import { NotificationType } from '../enums/notification-types.enum.js'
import { NotificationPreferences } from '../entities/notification-preferences.entity.js'
import { generateNotificationPreferencesUuid } from '../entities/notification-preferences.uuid.js'
import { generateUserUuid, UserUuid } from '../../../app/users/entities/user.uuid.js'

export class NotificationPreferencesEntityBuilder {
  private readonly notificationPreferences: NotificationPreferences

  constructor () {
    this.notificationPreferences = new NotificationPreferences()
    this.notificationPreferences.uuid = generateNotificationPreferencesUuid()
    this.notificationPreferences.userUuid = generateUserUuid()
    this.notificationPreferences.types = []
    this.notificationPreferences.channel = NotificationChannel.APP
    this.notificationPreferences.isEnabled = true
  }

  withUserUuid (userUuid: UserUuid): this {
    this.notificationPreferences.userUuid = userUuid
    return this
  }

  withTypes (types: NotificationType[]): this {
    this.notificationPreferences.types = types
    return this
  }

  withChannel (channel: NotificationChannel): this {
    this.notificationPreferences.channel = channel
    return this
  }

  withIsEnabled (isEnabled: boolean): this {
    this.notificationPreferences.isEnabled = isEnabled
    return this
  }

  build (): NotificationPreferences {
    return this.notificationPreferences
  }
}
