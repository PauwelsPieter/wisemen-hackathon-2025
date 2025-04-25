import { ApiErrorCode } from '../exceptions/api-errors/api-error-code.decorator.js'
import { ServiceUnavailableApiError } from '../exceptions/api-errors/service-unavailable.api-error.js'

export class S3UnavailableError extends ServiceUnavailableApiError {
  @ApiErrorCode('s3_unavailable')
  readonly code = 's3_unavailable'

  meta: never

  constructor (detail: string) {
    super(detail)
  }
}
