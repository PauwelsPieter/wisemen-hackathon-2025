import { ApiProperty } from '@nestjs/swagger'
import { NotificationType, NotificationTypeApiProperty } from '../../enums/notification-types.enum.js'
import { NotificationChannelApiProperty, NotificationChannel } from '../../enums/notification-channel.enum.js'
import { NOTIFICATION_TYPES_CONFIG } from '../../notification-types-config.js'

export class NotificationTypeChannelConfig {
  @NotificationChannelApiProperty()
  channel: NotificationChannel

  @ApiProperty({ type: Boolean })
  defaultValue: boolean

  @ApiProperty({ type: Boolean })
  isSupported: boolean

  constructor (channel: NotificationChannel, defaultValue: boolean, isSupported: boolean) {
    this.channel = channel
    this.defaultValue = defaultValue
    this.isSupported = isSupported
  }
}

export class NotificationTypeConfig {
  @NotificationTypeApiProperty()
  type: NotificationType

  @ApiProperty({ type: NotificationTypeChannelConfig, isArray: true })
  channelConfigs: NotificationTypeChannelConfig[]
}

export class GetNotificationTypesConfigResponse {
  @ApiProperty({ type: NotificationTypeConfig, isArray: true })
  items: NotificationTypeConfig[]

  constructor () {
    this.items = NOTIFICATION_TYPES_CONFIG
  }
}
