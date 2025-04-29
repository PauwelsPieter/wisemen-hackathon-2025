import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { AuthModule } from '../../../auth/auth.module.js'
import { UserNotification } from '../../entities/user-notification.entity.js'
import { ViewUserNotificationDetailController } from './view-user-notification-detail.controller.js'
import { ViewUserNotificationDetailUseCase } from './view-user-notification-detail.use-case.js'

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserNotification])
  ],
  providers: [ViewUserNotificationDetailUseCase],
  controllers: [ViewUserNotificationDetailController]
})
export class ViewUserNotificationDetailModule {}
