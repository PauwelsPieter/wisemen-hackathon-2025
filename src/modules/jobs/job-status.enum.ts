import { ApiPropertyOptions, ApiProperty } from '@nestjs/swagger'

export enum JobStatus {
  CREATED = 'created',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  RETRY = 'retry',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export function JobStatusApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: JobStatus,
    enumName: 'JobStatus'
  })
}
