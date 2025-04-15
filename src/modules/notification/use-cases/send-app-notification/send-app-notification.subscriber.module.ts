import { Module } from '@nestjs/common'
import { NatsPublisherModule } from '../../../nats/outbox/nats-publisher/nats-publisher.module.js'
import { SendAppNotificationSubscriber } from './send-app-notification.subscriber.js'

@Module({
  imports: [NatsPublisherModule],
  providers: [SendAppNotificationSubscriber]
})
export class SendAppNotificationSubscriberModule {}
