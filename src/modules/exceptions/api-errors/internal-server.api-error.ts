import { captureException } from '@sentry/nestjs'
import { HttpStatus } from '@nestjs/common'
import { EnvType } from '../../config/env.enum.js'
import { JsonApiErrorContent } from '../types/json-api-error.type.js'
import { ApiError } from './api-error.js'
import { ApiErrorStatus } from './api-error-status.decorator.js'
import { ApiErrorCode } from './api-error-code.decorator.js'

export class InternalServerApiError extends ApiError {
  @ApiErrorStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  status = '500'

  @ApiErrorCode('internal_server_error')
  code = 'internal_server_error'

  meta: never

  constructor (detail?: string) {
    super(detail ?? 'The server was unable to complete your request. Please try again later.')
  }
}

export class InternalServerErrorContent extends JsonApiErrorContent {
  constructor (error: Error) {
    super()

    if (process.env.NODE_ENV !== EnvType.PRODUCTION) {
      this.detail = error.message
    }

    this.code = 'internal_server_error'
    this.detail = 'The server was unable to complete your request. Please try again later.'
    this.status = String(HttpStatus.INTERNAL_SERVER_ERROR)
    this.id = captureException(error)
  }
}
