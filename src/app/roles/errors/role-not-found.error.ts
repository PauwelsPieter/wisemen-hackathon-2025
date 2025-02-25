import { NotFoundApiError } from '../../../modules/exceptions/api-errors/not-found.api-error.js'
import { ApiErrorCode } from '../../../modules/exceptions/api-errors/api-error-code.decorator.js'

export class RoleNotFoundError extends NotFoundApiError {
  @ApiErrorCode('role_not_found')
  code = 'role_not_found'

  meta: never

  constructor (roleUuid?: string) {
    super(`Role ${roleUuid ?? ''} not found`)
  }
}
