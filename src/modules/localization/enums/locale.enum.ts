import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export enum Locale {
  EN_US = 'en-US'
}

export function LocaleApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: Locale,
    enumName: 'Locale'
  })
}
