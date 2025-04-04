import { ApiProperty } from '@nestjs/swagger'
import { UiPreferences } from '../../entities/ui-preferences.entity.js'
import { UiTheme, UiThemeApiProperty } from '../../enums/theme.enum.js'
import { FontSize, FontSizeApiProperty } from '../../enums/font-size.enum.js'
import { Locale, LocaleApiProperty } from '../../../../modules/localization/enums/locale.enum.js'

export class ViewUiPreferencesResponse {
  @UiThemeApiProperty()
  theme: UiTheme

  @LocaleApiProperty()
  language: Locale

  @FontSizeApiProperty()
  fontSize: FontSize

  @ApiProperty({ type: 'boolean' })
  showShortcuts: boolean

  @ApiProperty({ type: 'boolean' })
  reduceMotion: boolean

  @ApiProperty({ type: 'boolean' })
  highContrast: boolean

  constructor (preferences: UiPreferences) {
    this.theme = preferences.theme
    this.language = preferences.language
    this.fontSize = preferences.fontSize
    this.showShortcuts = preferences.showShortcuts
    this.reduceMotion = preferences.reduceMotion
    this.highContrast = preferences.highContrast
  }
}
