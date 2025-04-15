import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { NotificationPreferences } from '../../entities/notification-preferences.entity.js'
import { AuthModule } from '../../../auth/auth.module.js'
import { UpdateMyNotificationTypePreferenceController } from './update-my-notification-type-preference.controller.js'
import { UpdateMyNotificationPreferenceTypeUseCase } from './update-my-notification-type-preference.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationPreferences]),
    AuthModule
  ],
  controllers: [
    UpdateMyNotificationTypePreferenceController
  ],
  providers: [
    UpdateMyNotificationPreferenceTypeUseCase
  ]
})
export class UpdateMyNotificationTypePreferenceModule {}
