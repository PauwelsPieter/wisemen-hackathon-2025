import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { UserNotification } from '../../entities/user-notification.entity.js'
import { LocalizationModule } from '../../../localization/modules/localization.module.js'
import { GetMyNotificationsController } from './get-my-notifications.controller.js'
import { GetMyNotificationsUseCase } from './get-my-notifications.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserNotification]),
    LocalizationModule
  ],
  controllers: [GetMyNotificationsController],
  providers: [GetMyNotificationsUseCase]
})
export class GetMyNotificationsModule {}
