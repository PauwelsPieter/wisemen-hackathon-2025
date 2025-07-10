import { Controller, Get } from '@nestjs/common'
import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { ViewUnreadNotificationsCountResponse } from './view-unread-notifications-count.response.js'
import { ViewUnreadNotificationsCountUseCase } from './view-unread-notifications-count.use-case.js'

@ApiTags('Notification')
@ApiOAuth2([])
@Controller('me/notifications/unread-count')
export class ViewUnreadNotificationsCountController {
  constructor (
    private readonly useCase: ViewUnreadNotificationsCountUseCase
  ) {}

  @Get()
  @Permissions(Permission.NOTIFICATION_READ_OWN)
  @ApiOkResponse({ type: ViewUnreadNotificationsCountResponse })
  async getUnreadCount (): Promise<ViewUnreadNotificationsCountResponse> {
    return await this.useCase.execute()
  }
}
