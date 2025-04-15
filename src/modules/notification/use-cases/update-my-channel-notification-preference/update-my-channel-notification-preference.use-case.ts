import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { NotificationPreferences } from '../../entities/notification-preferences.entity.js'
import { AuthContext } from '../../../auth/auth.context.js'
import { UpdateMyChannelNotificationPreferenceCommand } from './update-my-channel-notification-preference.command.js'

@Injectable()
export class UpdateMyChannelNotificationPreferenceUseCase {
  constructor (
    @InjectRepository(NotificationPreferences)
    private readonly notificationPreferencesRepository: Repository<NotificationPreferences>,
    private readonly authContext: AuthContext
  ) {}

  async execute (
    command: UpdateMyChannelNotificationPreferenceCommand
  ): Promise<void> {
    await this.notificationPreferencesRepository.update(
      {
        userUuid: this.authContext.getUserUuidOrFail(),
        channel: command.channel
      },
      { isEnabled: command.isEnabled }
    )
  }
}
