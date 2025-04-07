import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { DomainEventSubjectType } from './domain-event-subject-type.enum.js'

export function DomainEventSubjectTypeApiProperty (
  options?: ApiPropertyOptions
): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: DomainEventSubjectType,
    enumName: 'SubjectType'
  })
}
