import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { UserNotification } from '../../entities/user-notification.entity.js'
import { ViewUnreadNotificationsCountController } from './view-unread-notifications-count.controller.js'
import { ViewUnreadNotificationsCountUseCase } from './view-unread-notifications-count.use-case.js'

@Module({
  imports: [TypeOrmModule.forFeature([UserNotification])],
  controllers: [ViewUnreadNotificationsCountController],
  providers: [ViewUnreadNotificationsCountUseCase]
})
export class ViewUnreadNotificationsCountModule {}
