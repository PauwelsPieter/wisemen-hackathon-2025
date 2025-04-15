import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { AuthModule } from '../../../auth/auth.module.js'
import { NotificationPreferencesPreset } from '../../entities/notification-preferences-preset.entity.js'
import { DomainEventEmitterModule } from '../../../domain-events/domain-event-emitter.module.js'
import { UpdateMyNotificationPreferencePresetController } from './update-my-notification-preference-preset.controller.js'
import { UpdateNotificationPresetPreferenceUseCase } from './update-my-notification-preference-preset.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationPreferencesPreset]),
    DomainEventEmitterModule,
    AuthModule
  ],
  controllers: [
    UpdateMyNotificationPreferencePresetController
  ],
  providers: [
    UpdateNotificationPresetPreferenceUseCase
  ]
})
export class UpdateMyNotificationPreferencePresetModule {}
