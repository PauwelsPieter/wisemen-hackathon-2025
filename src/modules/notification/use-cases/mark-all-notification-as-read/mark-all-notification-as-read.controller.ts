import { Controller, HttpCode, HttpStatus, Patch } from '@nestjs/common'
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { AuthContext } from '../../../auth/auth.context.js'
import { MarkAllNotificationAsReadUseCase } from './mark-all-notification-as-read.use-case.js'

@ApiTags('Notifications')
@Controller('/me/notifications/mark-as-read')
export class MarkAllNotificationAsReadController {
  constructor (
    private readonly authContext: AuthContext,
    private readonly useCase: MarkAllNotificationAsReadUseCase
  ) {}

  @Patch()
  @Permissions(Permission.NOTIFICATION_UPDATE_READ)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async markNotificationsAsRead (): Promise<void> {
    await this.useCase.execute(this.authContext.getUserUuidOrFail())
  }
}
