import { NotificationType } from '../enums/notification-types.enum.js'
import { NotificationMigration } from '../entities/notification-migration.entity.js'

export class NotificationMigrationEntityBuilder {
  private readonly notificationMigration: NotificationMigration

  constructor () {
    this.notificationMigration = new NotificationMigration()
    this.notificationMigration.type = NotificationType.USER_CREATED
    this.notificationMigration.migratedAt = new Date()
  }

  withType (type: NotificationType): this {
    this.notificationMigration.type = type
    return this
  }

  withMigratedAt (migratedAt: Date): this {
    this.notificationMigration.migratedAt = migratedAt
    return this
  }

  build (): NotificationMigration {
    return this.notificationMigration
  }
}
