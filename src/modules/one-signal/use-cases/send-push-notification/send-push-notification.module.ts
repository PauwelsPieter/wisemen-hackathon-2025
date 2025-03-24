import { Module } from '@nestjs/common'
import { OneSignalClientModule } from '../../../one-signal-client/one-signal-client.module.js'
import { SendPushNotificationUseCase } from './send-push-notification.use-case.js'
import { SendPushNotificationController } from './send-push-notification.controller.js'

@Module({
  imports: [OneSignalClientModule],
  controllers: [SendPushNotificationController],
  providers: [SendPushNotificationUseCase]
})
export class SendPushNotificationModule {}
