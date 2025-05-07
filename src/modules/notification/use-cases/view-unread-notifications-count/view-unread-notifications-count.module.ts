import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { UserNotification } from '../../entities/user-notification.entity.js'
import { AuthModule } from '../../../auth/auth.module.js'
import { ViewUnreadNotificationsCountController } from './view-unread-notifications-count.controller.js'
import { ViewUnreadNotificationsCountUseCase } from './view-unread-notifications-count.use-case.js'

@Module({
  controllers: [ViewUnreadNotificationsCountController],
  providers: [ViewUnreadNotificationsCountUseCase],
  imports: [TypeOrmModule.forFeature([UserNotification]), AuthModule]
})
export class ViewUnreadNotificationsCountModule {}
