import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export enum NotificationType {
  USER_CREATED = 'user.created',
  TEST_NOTIFICATION = 'test-notification'
}

export function NotificationTypeApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: NotificationType,
    enumName: 'NotificationType'
  })
}
