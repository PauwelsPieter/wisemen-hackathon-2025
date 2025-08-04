import { Module } from '@nestjs/common'
import { PgBossSchedulerModule } from '@wisemen/pgboss-nestjs-job'
import { SendTestNotificationUseCase } from './send-test-notification.use-case.js'
import { SendTestNotificationController } from './send-test-notification.controller.js'

@Module({
  imports: [PgBossSchedulerModule],
  controllers: [SendTestNotificationController],
  providers: [SendTestNotificationUseCase]
})
export class SendTestNotificationModule {}
