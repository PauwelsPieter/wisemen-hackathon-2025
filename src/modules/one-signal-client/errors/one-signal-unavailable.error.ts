import { ApiErrorCode } from '../../exceptions/api-errors/api-error-code.decorator.js'
import { ServiceUnavailableApiError } from '../../exceptions/api-errors/service-unavailable.api-error.js'

export class OneSignalUnavailableError extends ServiceUnavailableApiError {
  @ApiErrorCode('one_signal_unavailable')
  readonly code = 'one_signal_unavailable'

  meta: never

  constructor (detail: string) {
    super(detail)
  }
}
