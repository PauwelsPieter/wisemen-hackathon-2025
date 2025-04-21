import { ApiErrorCode } from '../../exceptions/api-errors/api-error-code.decorator.js'
import { ServiceUnavailableApiError } from '../../exceptions/api-errors/service-unavailable.api-error.js'

export class ZitadelUnavailableError extends ServiceUnavailableApiError {
  @ApiErrorCode('zitadel_unavailable')
  readonly code = 'zitadel_unavailable'

  meta: never

  constructor (detail: string) {
    super(detail)
  }
}
