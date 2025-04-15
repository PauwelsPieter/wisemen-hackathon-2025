import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { NotificationPreferences } from '../../entities/notification-preferences.entity.js'
import { AuthContext } from '../../../auth/auth.context.js'
import { UpdateMyNotificationTypePreferenceCommand } from './update-my-notification-type-preference.command.js'

@Injectable()
export class UpdateMyNotificationPreferenceTypeUseCase {
  constructor (
    @InjectRepository(NotificationPreferences)
    private readonly notificationPreferencesRepository: Repository<NotificationPreferences>,
    private readonly authContext: AuthContext
  ) {}

  async execute (
    command: UpdateMyNotificationTypePreferenceCommand
  ): Promise<void> {
    const notificationPreference = await this.notificationPreferencesRepository.findOneByOrFail({
      userUuid: this.authContext.getUserUuidOrFail(),
      channel: command.channel
    })

    const addsTypes = command.isEnabled

    if (addsTypes) {
      notificationPreference.types.push(...command.types)
    } else {
      notificationPreference.types = notificationPreference.types.filter(
        notificationType => !command.types.includes(notificationType)
      )
    }

    await this.notificationPreferencesRepository.update(
      notificationPreference.uuid,
      { types: Array.from(new Set(notificationPreference.types)) }
    )
  }
}
