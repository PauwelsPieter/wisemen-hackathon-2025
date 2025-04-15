import { IsEnum, IsNotEmpty } from 'class-validator'
import { NotificationPreset, NotificationPresetApiProperty } from '../../enums/notification-preset.enum.js'

export class UpdateMyNotificationPreferencePresetCommand {
  @NotificationPresetApiProperty()
  @IsEnum(NotificationPreset)
  @IsNotEmpty()
  preset: NotificationPreset
}
