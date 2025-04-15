import { Injectable } from '@nestjs/common'
import { IntegrationEventWithTopic, NatsPublisher } from '../../../nats/outbox/nats-publisher/nats-publisher.js'
import { UserNotificationCreatedEvent } from '../create-user-notifications/user-notification.created.event.js'
import { NotificationChannel } from '../../enums/notification-channel.enum.js'
import { natsTopic } from '../../../nats/nats-topic.js'
import { UserNotificationCreatedIntegrationEvent } from './send-app-notification.integration.event.js'
import { USER_NOTIFICATION_CREATED_NATS_TOPIC } from './user-notification-created.nats-topic.js'

@Injectable()
export class SendAppNotificationSubscriber {
  constructor (
    private natsPublisher: NatsPublisher
  ) {}

  async on (events: UserNotificationCreatedEvent[]): Promise<void> {
    const appEvents = events.filter(event => event.content.channel === NotificationChannel.APP)

    const integrationEvents: IntegrationEventWithTopic[] = appEvents.map((event) => {
      return {
        event: new UserNotificationCreatedIntegrationEvent(event),
        onTopic: natsTopic(USER_NOTIFICATION_CREATED_NATS_TOPIC, {
          userId: event.content.userUuid,
          notificationId: event.content.notificationUuid
        })
      }
    })

    await this.natsPublisher.publish(integrationEvents)
  }
}
