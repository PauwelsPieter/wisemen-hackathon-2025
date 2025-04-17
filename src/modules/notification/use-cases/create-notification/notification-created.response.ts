import { ApiProperty } from '@nestjs/swagger'
import { NotificationUuid } from '../../entities/notification.uuid.js'

export class NotificationCreatedResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly uuid: NotificationUuid

  constructor (uuid: NotificationUuid) {
    this.uuid = uuid
  }
}
