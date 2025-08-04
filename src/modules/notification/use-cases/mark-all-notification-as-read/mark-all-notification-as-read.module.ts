import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { UserNotification } from '../../entities/user-notification.entity.js'
import { MarkAllNotificationAsReadController } from './mark-all-notification-as-read.controller.js'
import { MarkAllNotificationAsReadUseCase } from './mark-all-notification-as-read.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserNotification])
  ],
  controllers: [
    MarkAllNotificationAsReadController
  ],
  providers: [
    MarkAllNotificationAsReadUseCase
  ]
})
export class MarkAllNotificationAsReadModule {}
