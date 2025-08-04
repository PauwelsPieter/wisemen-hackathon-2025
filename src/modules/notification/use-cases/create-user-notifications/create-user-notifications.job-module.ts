import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Notification } from '../../entities/notification.entity.js'
import { UserNotification } from '../../entities/user-notification.entity.js'
import { NotificationPreferencesPreset } from '../../entities/notification-preferences-preset.entity.js'
import { CreateUserNotificationsUseCase } from './create-user-notifications.use-case.js'
import { CreateUserNotificationsJobHandler } from './create-user-notifications.job-handler.js'
import { CreateUserNotificationsRepository } from './create-user-notifications.repository.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      UserNotification,
      NotificationPreferencesPreset
    ])
  ],
  providers: [
    CreateUserNotificationsUseCase,
    CreateUserNotificationsJobHandler,
    CreateUserNotificationsRepository
  ]
})
export class CreateUserNotificationsJobModule {}
