import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { UserNotification } from '../../entities/user-notification.entity.js'
import { AuthModule } from '../../../auth/auth.module.js'
import { DomainEventEmitterModule } from '../../../domain-events/domain-event-emitter.module.js'
import { MarkNotificationAsUnreadController } from './mark-notification-as-unread.controller.js'
import { MarkNotificationAsUnreadUseCase } from './mark-notification-as-unread.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserNotification]),
    DomainEventEmitterModule,
    AuthModule
  ],
  controllers: [
    MarkNotificationAsUnreadController
  ],
  providers: [
    MarkNotificationAsUnreadUseCase
  ]
})
export class MarkNotificationAsUnreadModule {}
