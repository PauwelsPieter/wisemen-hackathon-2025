import { Injectable } from '@nestjs/common'
import { Permission } from '@nats-io/jwt'
import { UserUuid } from '../users/entities/user.uuid.js'
import { natsSubject } from '../../modules/nats/nats-application/nats-subject.js'
import { USER_NOTIFICATION_CREATED_NATS_TOPIC as USER_NOTIFICATION_CREATED_NATS_SUBJECT } from '../../modules/notification/use-cases/send-app-notification/user-notification-created.nats-topic.js'

export interface NatsPermissions {
  pub: Partial<Permission>
  sub: Partial<Permission>
}

@Injectable()
export class WebappNatsPermissions {
  getPermissionsFor (uuid: UserUuid): NatsPermissions {
    return {
      pub: { allow: [] },
      sub: { allow: [
        natsSubject(USER_NOTIFICATION_CREATED_NATS_SUBJECT, {
          userId: uuid,
          notificationId: '*'
        })
      ] }
    }
  }
}
