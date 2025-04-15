import { NotificationChannel } from '../../enums/notification-channel.enum.js'
import { UpdateMyChannelNotificationPreferenceCommand } from './update-my-channel-notification-preference.command.js'

export class UpdateMyChannelNotificationPreferenceCommandBuilder {
  private command: UpdateMyChannelNotificationPreferenceCommand
  constructor () {
    this.command = new UpdateMyChannelNotificationPreferenceCommand()
    this.command.channel = NotificationChannel.EMAIL
    this.command.isEnabled = true
  }

  withChannel (channel: NotificationChannel): this {
    this.command.channel = channel
    return this
  }

  withIsEnabled (isEnabled: boolean): this {
    this.command.isEnabled = isEnabled
    return this
  }

  build (): UpdateMyChannelNotificationPreferenceCommand {
    return this.command
  }
}
