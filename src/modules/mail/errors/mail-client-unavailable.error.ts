import { ApiErrorCode } from '../../exceptions/api-errors/api-error-code.decorator.js'
import { ServiceUnavailableApiError } from '../../exceptions/api-errors/service-unavailable.api-error.js'

export class MailUnavailableError extends ServiceUnavailableApiError {
  @ApiErrorCode('mail_unavailable')
  readonly code = 'mail_unavailable'

  readonly meta: never

  constructor (detail: string) {
    super(detail)
  }
}
