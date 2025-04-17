import { Controller, HttpCode, HttpStatus, Patch } from '@nestjs/common'
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { ApiNotFoundErrorResponse } from '../../../exceptions/api-errors/api-error-response.decorator.js'
import { UserNotificationNotFoundError } from '../../errors/user-notification-not-found.error.js'

import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { NotificationUuid } from '../../entities/notification.uuid.js'
import { MarkNotificationAsUnreadUseCase } from './mark-notification-as-unread.use-case.js'

@ApiTags('Notifications')
@Controller('/me/notifications/:notificationUuid/mark-as-unread')
export class MarkNotificationAsUnreadController {
  constructor (
    private readonly useCase: MarkNotificationAsUnreadUseCase
  ) {}

  @Patch()
  @Permissions(Permission.NOTIFICATION_UPDATE_UNREAD)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundErrorResponse(UserNotificationNotFoundError)
  async markNotificationAsUnread (
    @UuidParam('notificationUuid') notificationUuid: NotificationUuid
  ): Promise<void> {
    await this.useCase.execute(notificationUuid)
  }
}
