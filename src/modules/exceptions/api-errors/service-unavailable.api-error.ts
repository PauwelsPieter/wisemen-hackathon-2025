import { HttpStatus } from '@nestjs/common'
import { captureException } from '@sentry/nestjs'
import { JsonApiErrorContent } from '../types/json-api-error.type.js'
import { EnvType } from '../../config/env.enum.js'
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

export class ServiceUnavailableErrorContent extends JsonApiErrorContent {
  code = 'service_unavailable'
  message = 'The server was unable to complete your request. Please try again later.'

  constructor (error: ApiError) {
    super()

    if (process.env.NODE_ENV !== EnvType.PRODUCTION) {
      this.detail = error.detail
    }

    this.id = captureException(error)
  }
}
