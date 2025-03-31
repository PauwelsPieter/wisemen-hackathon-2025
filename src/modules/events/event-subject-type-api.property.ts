import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { EventSubjectType } from './event-subject-type.enum.js'

export function EventSubjectTypeApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: EventSubjectType,
    enumName: 'SubjectType'
  })
}
