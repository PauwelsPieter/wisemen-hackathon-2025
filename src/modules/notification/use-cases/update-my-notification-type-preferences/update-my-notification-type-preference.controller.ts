import { Body, Controller, HttpCode, HttpStatus, Patch } from '@nestjs/common'
import { ApiNoContentResponse, ApiOAuth2, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { UpdateMyNotificationPreferenceTypeUseCase } from './update-my-notification-type-preference.use-case.js'
import { UpdateMyNotificationTypePreferenceCommand } from './update-my-notification-type-preference.command.js'

@ApiTags('Notification Preferences')
@ApiOAuth2([])
@Controller('me/notification-preferences/types')
export class UpdateMyNotificationTypePreferenceController {
  constructor (
    private readonly useCase: UpdateMyNotificationPreferenceTypeUseCase
  ) {}

  @Patch()
  @Permissions(Permission.NOTIFICATION_PREFERENCES_UPDATE_TYPES)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async updateNotificationPreferenceTypes (
    @Body() command: UpdateMyNotificationTypePreferenceCommand
  ): Promise<void> {
    await this.useCase.execute(command)
  }
}
