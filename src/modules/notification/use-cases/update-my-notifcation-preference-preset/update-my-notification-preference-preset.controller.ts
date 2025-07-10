import { Body, Controller, HttpCode, HttpStatus, Patch } from '@nestjs/common'
import { ApiNoContentResponse, ApiOAuth2, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { UpdateNotificationPresetPreferenceUseCase } from './update-my-notification-preference-preset.use-case.js'
import { UpdateMyNotificationPreferencePresetCommand } from './update-my-notification-preference-preset.command.js'

@ApiTags('Notification Preferences')
@ApiOAuth2([])
@Controller('me/notification-preferences/preset')
export class UpdateMyNotificationPreferencePresetController {
  constructor (
    private readonly useCase: UpdateNotificationPresetPreferenceUseCase
  ) {}

  @Patch()
  @Permissions(Permission.NOTIFICATION_PREFERENCES_UPDATE_PRESET)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async updateNotificationPresetPreference (
    @Body() command: UpdateMyNotificationPreferencePresetCommand
  ): Promise<void> {
    await this.useCase.execute(command)
  }
}
