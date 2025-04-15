import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { UserNotification } from '../../entities/user-notification.entity.js'
import { AuthModule } from '../../../auth/auth.module.js'
import { DomainEventEmitterModule } from '../../../domain-events/domain-event-emitter.module.js'
import { MarkNotificationAsReadController } from './mark-notification-as-read.controller.js'
import { MarkNotificationAsReadUseCase } from './mark-notification-as-read.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserNotification]),
    DomainEventEmitterModule,
    AuthModule
  ],
  controllers: [
    MarkNotificationAsReadController
  ],
  providers: [
    MarkNotificationAsReadUseCase
  ]
})
export class MarkNotificationAsReadModule {}
