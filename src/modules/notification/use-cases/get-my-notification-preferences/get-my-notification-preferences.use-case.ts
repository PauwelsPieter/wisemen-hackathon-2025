import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { NotificationPreferences } from '../../entities/notification-preferences.entity.js'
import { ALL_NOTIFICATION_PREFERENCES, DEFAULT_NOTIFICATION_PREFERENCES } from '../../notification-types-config.js'
import { NotificationPreferencesPreset } from '../../entities/notification-preferences-preset.entity.js'
import { NotificationPreset } from '../../enums/notification-preset.enum.js'
import { exhaustiveCheck } from '../../../../utils/helpers/exhaustive-check.helper.js'
import { AuthContext } from '../../../auth/auth.context.js'
import { GetMyNotificationPreferencesResponse } from './get-my-notification-preferences.response.js'

@Injectable()
export class GetMyNotificationPreferencesUseCase {
  constructor (
    @InjectRepository(NotificationPreferences)
    private readonly notificationPreferencesRepository: Repository<NotificationPreferences>,
    @InjectRepository(NotificationPreferencesPreset)
    private readonly userPresetRepo: Repository<NotificationPreferencesPreset>,
    private readonly authContext: AuthContext
  ) {}

  async execute (): Promise<GetMyNotificationPreferencesResponse> {
    const userUuid = this.authContext.getUserUuidOrFail()
    const userPreset = await this.userPresetRepo.findOneByOrFail({ userUuid })
    const userPreferences = await this.getNotificationPreferences(userPreset.preset, userUuid)

    return new GetMyNotificationPreferencesResponse(userPreferences, userPreset.preset)
  }

  private async getNotificationPreferences (preset: NotificationPreset, userUuid: string):
  Promise<NotificationPreferences[]> {
    switch (preset) {
      case NotificationPreset.ALL:
        return ALL_NOTIFICATION_PREFERENCES
      case NotificationPreset.DEFAULT:
        return DEFAULT_NOTIFICATION_PREFERENCES
      case NotificationPreset.CUSTOM:
        return await this.notificationPreferencesRepository.findBy({ userUuid })
      case NotificationPreset.NONE:
        return []
      default:
        exhaustiveCheck(preset)
    }
  }
}
