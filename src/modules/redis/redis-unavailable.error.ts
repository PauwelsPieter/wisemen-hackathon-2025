import { ApiErrorCode } from '../exceptions/api-errors/api-error-code.decorator.js'
import { ServiceUnavailableApiError } from '../exceptions/api-errors/service-unavailable.api-error.js'

export class RedisUnavailableError extends ServiceUnavailableApiError {
  @ApiErrorCode('redis_unavailable')
  readonly code = 'redis_unavailable'

  meta: never

  constructor (detail: string) {
    super(detail)
  }
}
