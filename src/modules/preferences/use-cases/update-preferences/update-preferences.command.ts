import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Theme } from '../../types/theme.enum.js'

export class UpdatePreferencesCommand {
  @ApiProperty({ enum: Theme })
  @IsOptional()
  @IsEnum(Theme)
  theme?: Theme

  @ApiProperty({ type: String, example: 'en' })
  @IsOptional()
  @IsString()
  language?: string | null

  @ApiProperty({ type: String, example: 'default' })
  @IsOptional()
  @IsString()
  fontSize?: string | null

  @ApiProperty({ type: Boolean, example: false })
  @IsOptional()
  @IsBoolean()
  showShortcuts?: boolean

  @ApiProperty({ type: Boolean, example: false })
  @IsOptional()
  @IsBoolean()
  reduceMotion?: boolean

  @ApiProperty({ type: Boolean, example: false })
  @IsOptional()
  @IsBoolean()
  highContrast?: boolean
}
