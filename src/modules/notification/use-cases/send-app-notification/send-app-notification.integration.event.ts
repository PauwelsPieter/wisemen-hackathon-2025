import { Serializable } from '../../../../utils/types/serializable.js'
import { IntegrationEvent } from '../../../integration-events/integration-event.js'
import { IntegrationEventType } from '../../../integration-events/integration-event.type.js'
import { UserNotificationCreatedEvent } from '../create-user-notifications/user-notification.created.event.js'

interface UserNotificationCreatedIntegrationEventContent extends Serializable {
  userUuid: string
  notificationUuid: string
}

export class UserNotificationCreatedIntegrationEvent
  extends IntegrationEvent<UserNotificationCreatedIntegrationEventContent> {
  constructor (event: UserNotificationCreatedEvent) {
    super({
      version: 1,
      type: IntegrationEventType.USER_NOTIFICATION_CREATED,
      data: {
        userUuid: event.content.userUuid,
        notificationUuid: event.content.notificationUuid
      }
    })
  }
}
