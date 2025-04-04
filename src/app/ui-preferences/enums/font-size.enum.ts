import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export enum FontSize {
  SMALLER = 'smaller',
  SMALL = 'small',
  DEFAULT = 'default',
  LARGE = 'large',
  LARGER = 'larger'
}

export function FontSizeApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: FontSize,
    enumName: 'FontSize'
  })
}
