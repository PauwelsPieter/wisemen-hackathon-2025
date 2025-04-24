import { ApiProperty } from '@nestjs/swagger'
import { OneOfMeta } from '@wisemen/one-of'
import { Notification } from '../../entities/notification.entity.js'
import { NotificationType } from '../../enums/notification-types.enum.js'
import { Serializable } from '../../../../utils/types/serializable.js'

@OneOfMeta(Notification, NotificationType.TEST_NOTIFICATION)
export class TestNotificationContent {
  @ApiProperty({ type: 'string' })
  message: string

  constructor (message: string) {
    this.message = message
  }

  serialize (): Serializable {
    return this as unknown as Serializable
  }
}
