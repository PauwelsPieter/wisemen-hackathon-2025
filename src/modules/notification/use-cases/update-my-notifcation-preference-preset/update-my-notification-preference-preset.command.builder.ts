import { NotificationPreset } from '../../enums/notification-preset.enum.js'
import { UpdateMyNotificationPreferencePresetCommand } from './update-my-notification-preference-preset.command.js'

export class UpdateMyNotificationPreferencePresetCommandBuilder {
  private command: UpdateMyNotificationPreferencePresetCommand
  constructor () {
    this.command = new UpdateMyNotificationPreferencePresetCommand()
    this.command.preset = NotificationPreset.DEFAULT
  }

  withPreset (preset: NotificationPreset): this {
    this.command.preset = preset
    return this
  }

  build (): UpdateMyNotificationPreferencePresetCommand {
    return this.command
  }
}
