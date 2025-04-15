import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsEnum, IsNotEmpty } from 'class-validator'
import { NotificationChannel, NotificationChannelApiProperty } from '../../enums/notification-channel.enum.js'
import { NotificationType, NotificationTypeApiProperty } from '../../enums/notification-types.enum.js'

export class UpdateMyNotificationTypePreferenceCommand {
  @NotificationChannelApiProperty()
  @IsEnum(NotificationChannel)
  @IsNotEmpty()
  channel: NotificationChannel

  @ApiProperty({ type: Boolean })
  @IsNotEmpty()
  @IsBoolean()
  isEnabled: boolean

  @NotificationTypeApiProperty({ isArray: true })
  @IsEnum(NotificationType, { each: true })
  @IsNotEmpty()
  @IsArray()
  types: NotificationType[]
}
