import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { NotificationPreferences } from '../../entities/notification-preferences.entity.js'
import { AuthModule } from '../../../auth/auth.module.js'
import { NotificationPreferencesPreset } from '../../entities/notification-preferences-preset.entity.js'
import { GetMyNotificationPreferencesController } from './get-my-notification-preferences.controller.js'
import { GetMyNotificationPreferencesUseCase } from './get-my-notification-preferences.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationPreferences, NotificationPreferencesPreset]),
    AuthModule
  ],
  controllers: [
    GetMyNotificationPreferencesController
  ],
  providers: [
    GetMyNotificationPreferencesUseCase
  ]
})
export class GetMyNotificationPreferencesModule {}
