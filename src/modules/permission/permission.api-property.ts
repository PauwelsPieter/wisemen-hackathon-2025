import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { Permission } from './permission.enum.js'

export function PermissionApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: Permission,
    enumName: 'Permission'
  })
}
