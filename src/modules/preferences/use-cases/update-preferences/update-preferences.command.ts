import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsUndefinable } from '@wisemen/validators'
import { Theme } from '../../types/theme.enum.js'

export class UpdatePreferencesCommand {
  @ApiPropertyOptional({ enum: Theme, enumName: 'Theme' })
  @IsUndefinable()
  @IsEnum(Theme)
  theme?: Theme

  @ApiPropertyOptional({ type: String, example: 'en' })
  @IsOptional()
  @IsString()
  language?: string | null

  @ApiPropertyOptional({ type: String, example: 'default' })
  @IsOptional()
  @IsString()
  fontSize?: string | null

  @ApiPropertyOptional({ type: Boolean, example: false })
  @IsUndefinable()
  @IsBoolean()
  showShortcuts?: boolean

  @ApiPropertyOptional({ type: Boolean, example: false })
  @IsUndefinable()
  @IsBoolean()
  reduceMotion?: boolean

  @ApiPropertyOptional({ type: Boolean, example: false })
  @IsUndefinable()
  @IsBoolean()
  highContrast?: boolean
}
