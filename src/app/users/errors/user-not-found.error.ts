import { NotFoundApiError } from '../../../modules/exceptions/api-errors/not-found.api-error.js'
import { ApiErrorCode } from '../../../modules/exceptions/api-errors/api-error-code.decorator.js'
import { UserUuid } from '../entities/user.uuid.js'

export class UserNotFoundError extends NotFoundApiError {
  @ApiErrorCode('user_not_found')
  code = 'user_not_found'

  meta: never

  constructor (userUuid?: UserUuid) {
    super(`User ${userUuid ?? ''} not found`)
  }
}
