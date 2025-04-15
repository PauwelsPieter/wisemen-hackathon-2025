import { Controller, HttpCode, HttpStatus, Patch } from '@nestjs/common'
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { UserNotificationNotFoundError } from '../../errors/user-notification-not-found.error.js'
import { ApiNotFoundErrorResponse } from '../../../exceptions/api-errors/api-error-response.decorator.js'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { MarkNotificationAsReadUseCase } from './mark-notification-as-read.use-case.js'

@ApiTags('Notifications')
@Controller('/me/notifications/:notificationUuid/mark-as-read')
export class MarkNotificationAsReadController {
  constructor (
    private readonly useCase: MarkNotificationAsReadUseCase
  ) {}

  @Patch()
  @Permissions(Permission.NOTIFICATION_UPDATE_READ)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundErrorResponse(UserNotificationNotFoundError)
  async markNotificationAsRead (
    @UuidParam('notificationUuid') notificationUuid: string
  ): Promise<void> {
    await this.useCase.execute(notificationUuid)
  }
}
