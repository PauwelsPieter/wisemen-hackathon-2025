import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export enum UiTheme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export function UiThemeApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: UiTheme,
    enumName: 'UITheme'
  })
}
