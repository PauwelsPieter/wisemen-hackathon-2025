import { Controller, Get } from '@nestjs/common'
import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { GetNotificationTypesConfigResponse } from './get-notification-types-config.response.js'

@ApiTags('Notification Preferences')
@ApiOAuth2([])
@Controller('notification-preferences/config')
export class GetNotificationTypesConfigController {
  @Get()
  @Permissions(Permission.NOTIFICATION_READ_CONFIG)
  @ApiOkResponse({ type: GetNotificationTypesConfigResponse })
  getNotificationPreferencesConfig (): GetNotificationTypesConfigResponse {
    return new GetNotificationTypesConfigResponse()
  }
}
