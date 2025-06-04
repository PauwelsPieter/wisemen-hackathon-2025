import { ApiErrorCode } from '../exceptions/api-errors/api-error-code.decorator.js'
import { ServiceUnavailableApiError } from '../exceptions/api-errors/service-unavailable.api-error.js'

export class TwilioUnavailableError extends ServiceUnavailableApiError {
  @ApiErrorCode('twilio_unavailable')
  readonly code = 'twilio_unavailable'

  meta: never

  constructor (detail: string) {
    super(detail)
  }
}
