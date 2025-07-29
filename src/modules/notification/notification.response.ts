import assert from 'assert'
import { ApiProperty } from '@nestjs/swagger'
import { OneOfMetaApiProperty, OneOfResponse, OneOfTypeApiProperty } from '@wisemen/one-of'
import { Locale } from '../localization/enums/locale.enum.js'
import { Serializable } from '../../utils/types/serializable.js'
import { User } from '../../app/users/entities/user.entity.js'
import { tc } from '../localization/helpers/translate.helper.js'
import { NotificationType } from './enums/notification-types.enum.js'
import { Notification } from './entities/notification.entity.js'
import { UserNotification } from './entities/user-notification.entity.js'

class CreatedByUserResponse {
  @ApiProperty({ format: 'uuid' })
  uuid: string

  @ApiProperty()
  name: string

  constructor (user: User) {
    this.uuid = user.uuid
    this.name = user.fullName
  }
}

@OneOfResponse(Notification)
export class NotificationResponse {
  @ApiProperty({ format: 'date-time' })
  createdAt: string

  @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
  readAt: string | null

  @ApiProperty({ format: 'uuid' })
  notificationUuid: string

  @ApiProperty({ type: CreatedByUserResponse, nullable: true })
  createdByUser: CreatedByUserResponse | null

  @ApiProperty()
  message: string

  @OneOfTypeApiProperty()
  type: NotificationType

  @OneOfMetaApiProperty()
  meta: Serializable

  constructor (userNotification: UserNotification, language?: Locale) {
    assert(userNotification.notification !== undefined, new Error('notification not loaded'))
    assert(userNotification.notification.createdByUser !== undefined, new Error('createdByUser not loaded'))

    this.createdAt = userNotification.notification.createdAt.toISOString()
    this.createdByUser = userNotification.notification.createdByUser
      ? new CreatedByUserResponse(userNotification.notification.createdByUser)
      : null
    this.message = this.getMessage(userNotification.notification, language)
    this.readAt = userNotification.readAt?.toISOString() ?? null
    this.type = userNotification.notification.type
    this.meta = userNotification.notification.meta
    this.notificationUuid = userNotification.notification.uuid
  }

  private getMessage (notification: Notification, lang?: Locale): string {
    return tc(`notifications.${notification.type}.content`, { lang })
  }
}
