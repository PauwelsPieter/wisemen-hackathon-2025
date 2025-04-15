import { randomUUID } from 'node:crypto'
import { NotificationPreferencesPreset } from '../entities/notification-preferences-preset.entity.js'
import { NotificationPreset } from '../enums/notification-preset.enum.js'

export class NotificationPreferencesPresetEntityBuilder {
  private readonly preferencesPreset: NotificationPreferencesPreset

  constructor () {
    this.preferencesPreset = new NotificationPreferencesPreset()
    this.preferencesPreset.userUuid = randomUUID()
    this.preferencesPreset.preset = NotificationPreset.DEFAULT
  }

  withUserUuid (userUuid: string): this {
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
