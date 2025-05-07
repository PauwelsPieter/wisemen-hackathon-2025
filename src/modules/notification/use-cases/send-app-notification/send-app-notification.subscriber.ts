import { Injectable } from '@nestjs/common'
import { IntegrationEventWithSubject, NatsPublisher } from '../../../nats/outbox/nats-publisher/nats-publisher.js'
import { UserNotificationCreatedEvent } from '../create-user-notifications/user-notification.created.event.js'
import { NotificationChannel } from '../../enums/notification-channel.enum.js'
import { Subscribe } from '../../../domain-events/subscribe.decorator.js'
import { natsSubject } from '../../../nats/nats-application/nats-subject.js'
import { UserNotificationCreatedIntegrationEvent } from './send-app-notification.integration.event.js'
import { USER_NOTIFICATION_CREATED_NATS_TOPIC } from './user-notification-created.nats-topic.js'

@Injectable()
export class SendAppNotificationSubscriber {
  constructor (
    private natsPublisher: NatsPublisher
  ) {}

  @Subscribe(UserNotificationCreatedEvent)
  async on (events: UserNotificationCreatedEvent[]): Promise<void> {
    const appEvents = events.filter(event => event.content.channel === NotificationChannel.APP)

    const integrationEvents: IntegrationEventWithSubject[] = appEvents.map((event) => {
      return {
        event: new UserNotificationCreatedIntegrationEvent(event),
        onSubject: natsSubject(USER_NOTIFICATION_CREATED_NATS_TOPIC, {
          userId: event.content.userUuid,
          notificationId: event.content.notificationUuid
        })
      }
    })

    await this.natsPublisher.publish(integrationEvents)
  }
}
