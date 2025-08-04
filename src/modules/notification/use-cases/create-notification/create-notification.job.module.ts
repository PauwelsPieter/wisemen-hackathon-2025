import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Notification } from '../../entities/notification.entity.js'
import { CreateNotificationUseCase } from './create-notification.use-case.js'
import { CreateNotificationJobHandler } from './create-notification.job-handler.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification])
  ],
  providers: [
    CreateNotificationJobHandler,
    CreateNotificationUseCase
  ],
  exports: [CreateNotificationUseCase]
})
export class CreateNotificationJobModule {}
