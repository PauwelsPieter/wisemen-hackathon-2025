import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export enum NotificationType {
  USER_CREATED = 'user.created'
}

export function NotificationTypeApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: NotificationType,
    enumName: 'NotificationType'
  })
}
