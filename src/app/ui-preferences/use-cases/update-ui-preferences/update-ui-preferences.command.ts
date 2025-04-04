import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsUndefinable } from '@wisemen/validators'
import { UiTheme, UiThemeApiProperty } from '../../enums/theme.enum.js'
import { FontSize, FontSizeApiProperty } from '../../enums/font-size.enum.js'
import { Locale, LocaleApiProperty } from '../../../../modules/localization/enums/locale.enum.js'

export class UpdateUiPreferencesCommand {
  @UiThemeApiProperty({ required: false })
  @IsUndefinable()
  @IsEnum(UiTheme)
  theme?: UiTheme

  @LocaleApiProperty({ required: false })
  @IsOptional()
  @IsString()
  language?: Locale

  @FontSizeApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fontSize?: FontSize

  @ApiPropertyOptional({ type: 'boolean', required: false })
  @IsUndefinable()
  @IsBoolean()
  showShortcuts?: boolean

  @ApiPropertyOptional({ type: 'boolean', required: false })
  @IsUndefinable()
  @IsBoolean()
  reduceMotion?: boolean

  @ApiPropertyOptional({ type: 'boolean', required: false })
  @IsUndefinable()
  @IsBoolean()
  highContrast?: boolean
}
