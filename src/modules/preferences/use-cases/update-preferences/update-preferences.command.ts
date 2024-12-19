import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Theme } from '../../types/theme.enum.js'

export class UpdatePreferencesCommand {
  @ApiPropertyOptional({ enum: Theme })
  @IsOptional()
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
  @IsOptional()
  @IsBoolean()
  showShortcuts?: boolean

  @ApiPropertyOptional({ type: Boolean, example: false })
  @IsOptional()
  @IsBoolean()
  reduceMotion?: boolean

  @ApiPropertyOptional({ type: Boolean, example: false })
  @IsOptional()
  @IsBoolean()
  highContrast?: boolean
}
