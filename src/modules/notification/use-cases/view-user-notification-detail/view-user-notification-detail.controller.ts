import { Controller, Get, HttpStatus } from '@nestjs/common'
import { ApiOAuth2, ApiTags } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { OneOfApiResponse } from '@wisemen/one-of'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { NotificationUuid } from '../../entities/notification.uuid.js'
import { NotificationResponse } from '../../notification.response.js'
import { Notification } from '../../entities/notification.entity.js'
import { ApiNotFoundErrorResponse } from '../../../exceptions/api-errors/api-error-response.decorator.js'
import { UserNotificationNotFoundError } from '../../errors/user-notification-not-found.error.js'
import { ViewUserNotificationDetailUseCase } from './view-user-notification-detail.use-case.js'

@ApiTags('Notification')
@ApiOAuth2([])
@Controller('me/notifications/:notificationUuid')
export class ViewUserNotificationDetailController {
  constructor (
    private readonly useCase: ViewUserNotificationDetailUseCase
  ) {}

  @Get()
  @Permissions(Permission.NOTIFICATION_READ_OWN)
  @OneOfApiResponse(Notification, { status: HttpStatus.OK })
  @ApiNotFoundErrorResponse(UserNotificationNotFoundError)
  async getNotificationDetail (
    @UuidParam('notificationUuid') notificationUuid: NotificationUuid
  ): Promise<NotificationResponse> {
    return await this.useCase.execute(notificationUuid)
  }
}
