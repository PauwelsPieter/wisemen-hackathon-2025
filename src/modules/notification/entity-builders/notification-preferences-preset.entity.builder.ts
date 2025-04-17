import { NotificationPreferencesPreset } from '../entities/notification-preferences-preset.entity.js'
import { NotificationPreset } from '../enums/notification-preset.enum.js'
import { generateUserUuid, UserUuid } from '../../../app/users/entities/user.uuid.js'

export class NotificationPreferencesPresetEntityBuilder {
  private readonly preferencesPreset: NotificationPreferencesPreset

  constructor () {
    this.preferencesPreset = new NotificationPreferencesPreset()
    this.preferencesPreset.userUuid = generateUserUuid()
    this.preferencesPreset.preset = NotificationPreset.DEFAULT
  }

  withUserUuid (userUuid: UserUuid): this {
    this.preferencesPreset.userUuid = userUuid
    return this
  }

  withPreset (preset: NotificationPreset): this {
    this.preferencesPreset.preset = preset
    return this
  }

  build (): NotificationPreferencesPreset {
    return this.preferencesPreset
  }
}
