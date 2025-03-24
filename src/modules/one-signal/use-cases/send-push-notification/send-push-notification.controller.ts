import { Body, Controller, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiOAuth2, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { SendPushNotificationUseCase } from './send-push-notification.use-case.js'
import { SendPushNotificationCommand } from './send-push-notification.command.js'

@Controller()
@ApiTags('OneSignal')
@ApiOAuth2([])
export class SendPushNotificationController {
  constructor (
    private readonly sendPushNotificationUseCase: SendPushNotificationUseCase
  ) {}

  @Post('onesignal/push-notification')
  @Permissions(Permission.SEND_PUSH_NOTIFICATION)
  @ApiCreatedResponse()
  sendPushNotification (
    @Body() command: SendPushNotificationCommand
  ) {
    return this.sendPushNotificationUseCase.execute(command)
  }
}
