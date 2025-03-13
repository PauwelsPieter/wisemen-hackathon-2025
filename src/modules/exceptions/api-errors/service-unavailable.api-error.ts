import { HttpStatus } from '@nestjs/common'
import { ApiError } from './api-error.js'
import { ApiErrorStatus } from './api-error-status.decorator.js'

export abstract class ServiceUnavailableApiError extends ApiError {
  @ApiErrorStatus(HttpStatus.SERVICE_UNAVAILABLE)
  declare status: '503'

  constructor (detail: string) {
    super(detail)
    this.status = '503'
  }
}
