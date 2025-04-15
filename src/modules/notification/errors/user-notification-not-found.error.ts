import { ApiErrorCode } from '../../exceptions/api-errors/api-error-code.decorator.js'
import { NotFoundApiError } from '../../exceptions/api-errors/not-found.api-error.js'

export class UserNotificationNotFoundError extends NotFoundApiError {
  @ApiErrorCode('user_notification_not_found')
  code = 'user_notification_not_found'

  meta: never

  constructor (notificationUuid: string) {
    super(`User notification with notification ${notificationUuid} not found`)
  }
}
