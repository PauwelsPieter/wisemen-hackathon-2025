import { NotificationType } from '../../enums/notification-types.enum.js'
import { MigrateNotificationTypesCommand } from './migrate-notification-types.command.js'

export class MigrateNotificationTypesCommandBuilder {
  private command: MigrateNotificationTypesCommand
  constructor () {
    this.command = new MigrateNotificationTypesCommand()
    this.command.types = []
  }

  withTypes (types: NotificationType[]): this {
    this.command.types = types
    return this
  }

  build (): MigrateNotificationTypesCommand {
    return this.command
  }
}
