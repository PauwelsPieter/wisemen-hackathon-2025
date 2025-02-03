import { ApiProperty } from '@nestjs/swagger'
import { Preferences } from '../../entities/preferences.entity.js'
import { Theme } from '../../types/theme.enum.js'

export class ViewPreferencesResponse {
  @ApiProperty({ enum: Theme, enumName: 'Theme' })
  theme: Theme

  @ApiProperty({ type: String, nullable: true })
  language: string | null

  @ApiProperty({ type: String, nullable: true })
  fontSize: string | null

  @ApiProperty({ type: Boolean })
  showShortcuts: boolean

  @ApiProperty({ type: Boolean })
  reduceMotion: boolean

  @ApiProperty({ type: Boolean })
  highContrast: boolean

  constructor (preferences: Preferences) {
    this.theme = preferences.theme
    this.language = preferences.language
    this.fontSize = preferences.fontSize
    this.showShortcuts = preferences.showShortcuts
    this.reduceMotion = preferences.reduceMotion
    this.highContrast = preferences.highContrast
  }
}
