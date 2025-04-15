import { Body, Controller, HttpCode, HttpStatus, Patch } from '@nestjs/common'
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { UpdateMyChannelNotificationPreferenceUseCase } from './update-my-channel-notification-preference.use-case.js'
import { UpdateMyChannelNotificationPreferenceCommand } from './update-my-channel-notification-preference.command.js'

@ApiTags('Notification Preferences')
@Controller('me/notification-preferences/channels')
export class UpdateMyChannelNotificationPreferenceController {
  constructor (
    private readonly useCase: UpdateMyChannelNotificationPreferenceUseCase
  ) {}

  @Patch()
  @Permissions(Permission.NOTIFICATION_PREFERENCES_UPDATE_CHANNEL)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async updateGlobalNotificationPreferences (
    @Body() command: UpdateMyChannelNotificationPreferenceCommand
  ): Promise<void> {
    await this.useCase.execute(command)
  }
}
