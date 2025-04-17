import { UiTheme } from '../enums/theme.enum.js'
import { FontSize } from '../enums/font-size.enum.js'
import { Locale } from '../../../modules/localization/enums/locale.enum.js'
import { generateUserUuid, UserUuid } from '../../users/entities/user.uuid.js'
import { UiPreferences } from './ui-preferences.entity.js'

export class UIPreferencesEntityBuilder {
  private preference: UiPreferences

  constructor () {
    this.preference = new UiPreferences()

    this.preference.userUuid = generateUserUuid()
    this.preference.createdAt = new Date()
    this.preference.updatedAt = new Date()
    this.preference.fontSize = FontSize.DEFAULT
    this.preference.language = Locale.EN_US
    this.preference.highContrast = false
    this.preference.reduceMotion = false
    this.preference.showShortcuts = false
    this.preference.theme = UiTheme.SYSTEM

    return this
  }

  withUserUuid (userUuid: UserUuid): this {
    this.preference.userUuid = userUuid
    return this
  }

  withCreatedAt (createdAt: Date): this {
    this.preference.createdAt = createdAt
    return this
  }

  withUpdatedAt (updatedAt: Date): this {
    this.preference.updatedAt = updatedAt
    return this
  }

  withFontSize (fontSize: FontSize): this {
    this.preference.fontSize = fontSize
    return this
  }

  withLanguage (language: Locale): this {
    this.preference.language = language
    return this
  }

  withHighContrast (highContrast: boolean): this {
    this.preference.highContrast = highContrast
    return this
  }

  withReduceMotion (reduceMotion: boolean): this {
    this.preference.reduceMotion = reduceMotion
    return this
  }

  withShowShortcuts (showShortcuts: boolean): this {
    this.preference.showShortcuts = showShortcuts
    return this
  }

  withTheme (theme: UiTheme): this {
    this.preference.theme = theme
    return this
  }

  build (): UiPreferences {
    return this.preference
  }
}
