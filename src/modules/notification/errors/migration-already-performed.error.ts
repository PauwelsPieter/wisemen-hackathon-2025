import { ApiErrorCode } from '../../exceptions/api-errors/api-error-code.decorator.js'
import { ApiErrorMeta } from '../../exceptions/api-errors/api-error-meta.decorator.js'
import { BadRequestApiError } from '../../exceptions/api-errors/bad-request.api-error.js'
import { NotificationType, NotificationTypeApiProperty } from '../enums/notification-types.enum.js'

class MigrationAlreadyPerformedErrorMeta {
  @NotificationTypeApiProperty({ isArray: true })
  readonly type: NotificationType

  constructor (type: NotificationType) {
    this.type = type
  }
}

export class MigrationAlreadyPerformedError extends BadRequestApiError {
  @ApiErrorCode('migration_already_performed')
  readonly code = 'migration_already_performed'

  @ApiErrorMeta()
  readonly meta: MigrationAlreadyPerformedErrorMeta

  constructor (type: NotificationType) {
    super(`The migrations are already performed for the type: ${type}`)
    this.meta = new MigrationAlreadyPerformedErrorMeta(type)
  }
}
