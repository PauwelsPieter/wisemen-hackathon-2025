import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { NotificationPreferences } from '../../../notification/entities/notification-preferences.entity.js'
import { DomainEventEmitterModule } from '../../../domain-events/domain-event-emitter.module.js'
import { NotificationPreferencesPreset } from '../../entities/notification-preferences-preset.entity.js'
import { User } from '../../../../app/users/entities/user.entity.js'
import { AssignDefaultNotificationPreferencesToUserUseCase } from './assign-default-notification-preferences-to-user.use-case.js'
import { AssignDefaultNotificationPreferencesToUserRepository } from './assign-default-notification-preferences-to-user.repository.js'
import { AssignDefaultNotificationPreferencesToUserJobHandler } from './assign-default-notification-preferences-to-user.job-handler.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      NotificationPreferences,
      NotificationPreferencesPreset
    ]),
    DomainEventEmitterModule
  ],
  providers: [
    AssignDefaultNotificationPreferencesToUserJobHandler,
    AssignDefaultNotificationPreferencesToUserUseCase,
    AssignDefaultNotificationPreferencesToUserRepository
  ]
})
export class AssignDefaultNotificationPreferencesToUserJobModule {}
