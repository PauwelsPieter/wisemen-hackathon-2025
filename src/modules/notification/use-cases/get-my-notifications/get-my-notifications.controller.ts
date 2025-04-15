import { Controller, Get, Query } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { GetMyNotificationsResponse } from './get-my-notifications.response.js'
import { GetMyNotificationsUseCase } from './get-my-notifications.use-case.js'
import { GetMyNotificationsQuery } from './query/get-my-notifications.query.js'

@ApiTags('Notifications')
@Controller('/me/notifications')
export class GetMyNotificationsController {
  constructor (
    private readonly useCase: GetMyNotificationsUseCase
  ) {}

  @Get()
  @Permissions(Permission.NOTIFICATION_READ_OWN)
  @ApiOkResponse({ type: GetMyNotificationsResponse })
  async getNotifications (
     @Query() query: GetMyNotificationsQuery
  ): Promise<GetMyNotificationsResponse> {
    return await this.useCase.getNotifications(query)
  }
}
