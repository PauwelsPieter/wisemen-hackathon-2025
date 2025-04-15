import { NotificationChannel } from '../../enums/notification-channel.enum.js'
import { NotificationType } from '../../enums/notification-types.enum.js'
import { UpdateMyNotificationTypePreferenceCommand } from './update-my-notification-type-preference.command.js'

export class UpdateMyNotificationTypePreferenceCommandBuilder {
  private command: UpdateMyNotificationTypePreferenceCommand
  constructor () {
    this.command = new UpdateMyNotificationTypePreferenceCommand()
    this.command.channel = NotificationChannel.EMAIL
    this.command.isEnabled = true
    this.command.types = []
  }

  withChannel (channel: NotificationChannel): this {
    this.command.channel = channel
    return this
  }

  withIsEnabled (isEnabled: boolean): this {
    this.command.isEnabled = isEnabled
    return this
  }

  withTypes (types: NotificationType[]): this {
    this.command.types = types
    return this
  }

  build (): UpdateMyNotificationTypePreferenceCommand {
    return this.command
  }
}
