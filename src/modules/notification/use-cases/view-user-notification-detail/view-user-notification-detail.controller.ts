import { Controller, Get, HttpStatus } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { OneOfApiResponse } from '@wisemen/one-of'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { NotificationUuid } from '../../entities/notification.uuid.js'
import { NotificationResponse } from '../../notification.response.js'
import { Notification } from '../../entities/notification.entity.js'
import { ViewUserNotificationDetailUseCase } from './view-user-notification-detail.use-case.js'

@ApiTags('Notification')
@Controller('me/notifications/:notificationUuid')
export class ViewUserNotificationDetailController {
  constructor (
    private readonly useCase: ViewUserNotificationDetailUseCase
  ) {}

  @Get()
  @Permissions(Permission.NOTIFICATION_READ_OWN)
  @OneOfApiResponse(Notification, { status: HttpStatus.OK })
  async getNotificationDetail (
    @UuidParam('notificationUuid') notificationUuid: NotificationUuid
  ): Promise<NotificationResponse> {
    return await this.useCase.execute(notificationUuid)
  }
}
