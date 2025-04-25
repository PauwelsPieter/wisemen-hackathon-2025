import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { NotificationPreferences } from '../../entities/notification-preferences.entity.js'
import { NotificationPreferencesPreset } from '../../entities/notification-preferences-preset.entity.js'
import { UserUuid } from '../../../../app/users/entities/user.uuid.js'
import { User } from '../../../../app/users/entities/user.entity.js'

@Injectable()
export class AssignDefaultNotificationPreferencesToUserRepository {
  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(NotificationPreferences)
    private readonly preferencesRepository: Repository<NotificationPreferences>,
    @InjectRepository(NotificationPreferencesPreset)
    private readonly presetRepository: Repository<NotificationPreferencesPreset>
  ) {}

  async userExists (uuid: UserUuid): Promise<boolean> {
    return await this.userRepository.existsBy({ uuid })
  }

  async savePreferences (defaultPreferences: NotificationPreferences[]): Promise<void> {
    await this.preferencesRepository.createQueryBuilder()
      .insert()
      .into(NotificationPreferences)
      .values(defaultPreferences)
      .orIgnore()
      .execute()
  }

  async savePreset (preset: NotificationPreferencesPreset): Promise<void> {
    await this.presetRepository.insert(preset)
  }
}
