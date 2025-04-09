import { ApiPropertyOptions, ApiProperty } from '@nestjs/swagger'

export enum QueueName {
  SYSTEM = 'system'
}

export function QueuenameApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: QueueName,
    enumName: 'QueueName'
  })
}
