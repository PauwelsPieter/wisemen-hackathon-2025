import { ApiErrorCode } from '../../exceptions/api-errors/api-error-code.decorator.js'
import { ServiceUnavailableApiError } from '../../exceptions/api-errors/service-unavailable.api-error.js'

export class TypesenseUnavailableError extends ServiceUnavailableApiError {
  @ApiErrorCode('typesense_unavailable')
  readonly code = 'typesense_unavailable'

  meta: never

  constructor (detail: string) {
    super(detail)
  }
}
