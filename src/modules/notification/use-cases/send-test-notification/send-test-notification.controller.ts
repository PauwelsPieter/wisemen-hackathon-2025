import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiNoContentResponse, ApiOAuth2, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { AuthContext } from '../../../auth/auth.context.js'
import { SendTestNotificationUseCase } from './send-test-notification.use-case.js'
import { SendTestNotificationCommand } from './send-test-notification.command.js'

@ApiTags('Notifications')
@ApiOAuth2([])
@Controller('notifications/test-notification')
export class SendTestNotificationController {
  constructor (
    private readonly useCase: SendTestNotificationUseCase,
    private readonly authContext: AuthContext
  ) {}

  @Post()
  @Permissions(Permission.NOTIFICATION_SEND_TEST)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async sendTestNotification (
    @Body() command: SendTestNotificationCommand
  ): Promise<void> {
    await this.useCase.execute(command, this.authContext.getUserUuidOrFail())
  }
}
