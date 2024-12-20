import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Theme } from '../../types/theme.enum.js'
import { IsUndefinable } from '../../../../utils/validators/is-undefinable.validator.js'

export class UpdatePreferencesCommand {
  @ApiPropertyOptional({ enum: Theme })
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
