import { NotificationType } from '../enums/notification-types.enum.js'
import { Notification } from '../entities/notification.entity.js'
import { Serializable } from '../../../utils/types/serializable.js'
import { generateNotificationUuid } from '../entities/notification.uuid.js'
import { UserUuid } from '../../../app/users/entities/user.uuid.js'

export class NotificationEntityBuilder {
  private readonly notification: Notification

  constructor () {
    this.notification = new Notification()
    this.notification.createdAt = new Date()
    this.notification.uuid = generateNotificationUuid()
    this.notification.meta = {}
    this.notification.type = NotificationType.TEST_NOTIFICATION
  }

  withCreatedByUserUuid (createdByUserUuid: UserUuid | null): this {
    this.notification.createdByUserUuid = createdByUserUuid
    return this
  }

  withType (type: NotificationType): this {
    this.notification.type = type
    return this
  }

  withMeta (meta: Serializable): this {
    this.notification.meta = meta
    return this
  }

  build (): Notification {
    return this.notification
  }
}
