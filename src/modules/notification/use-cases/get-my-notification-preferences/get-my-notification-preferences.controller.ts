import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { GetMyNotificationPreferencesResponse } from './get-my-notification-preferences.response.js'
import { GetMyNotificationPreferencesUseCase } from './get-my-notification-preferences.use-case.js'

@ApiTags('Notification Preferences')
@Controller('me/notification-preferences')
export class GetMyNotificationPreferencesController {
  constructor (
    private readonly useCase: GetMyNotificationPreferencesUseCase
  ) {}

  @Get()
  @Permissions(Permission.NOTIFICATION_PREFRENCES_READ_OWN)
  @ApiOkResponse({ type: GetMyNotificationPreferencesResponse })
  async getNotificationPreferences (
  ): Promise<GetMyNotificationPreferencesResponse> {
    return await this.useCase.execute()
  }
}
