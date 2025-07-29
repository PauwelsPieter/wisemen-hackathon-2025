import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { Column, ColumnOptions } from 'typeorm'

export enum NotificationType {
  USER_CREATED = 'user.created',
  TEST_NOTIFICATION = 'system.test-notification'
}

export function NotificationTypeApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: NotificationType,
    enumName: 'NotificationType'
  })
}

type NotificationTypeColumnOptions = Omit<ColumnOptions, 'type' | 'enum' | 'enumName'>
export function NotificationTypeColumn (
  options?: NotificationTypeColumnOptions
): PropertyDecorator {
  return Column({
    ...options,
    type: 'enum',
    enum: NotificationType,
    enumName: 'notification_type'
  })
}
