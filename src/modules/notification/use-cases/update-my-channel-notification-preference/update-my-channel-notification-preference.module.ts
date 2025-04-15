import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { NotificationPreferences } from '../../entities/notification-preferences.entity.js'
import { AuthModule } from '../../../auth/auth.module.js'
import { UpdateMyChannelNotificationPreferenceController } from './update-my-channel-notification-preference.controller.js'
import { UpdateMyChannelNotificationPreferenceUseCase } from './update-my-channel-notification-preference.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationPreferences]),
    AuthModule
  ],
  controllers: [
    UpdateMyChannelNotificationPreferenceController
  ],
  providers: [
    UpdateMyChannelNotificationPreferenceUseCase
  ]
})
export class UpdateMyChannelNotificationPreferenceModule {}
