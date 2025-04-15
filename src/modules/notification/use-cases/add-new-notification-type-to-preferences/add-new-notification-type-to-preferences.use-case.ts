import { Injectable } from '@nestjs/common'
import { NotificationType } from '../../enums/notification-types.enum.js'
import { getDefaultForType } from '../../notification-types-config.js'
import { notificationCategory } from '../../notification-category.js'
import { AddNewNotificationTypeToPreferenceRepository } from './add-new-notification-type-to-preferences.repository.js'

@Injectable()
export class AddNewNotificationTypeToPreferencesUseCase {
  constructor (
    private readonly repo: AddNewNotificationTypeToPreferenceRepository
  ) {}

  async execute (type: NotificationType, isNewCategory: boolean): Promise<void> {
    const defaultChannels = getDefaultForType(type).defaultChannels
    const batchSize = 1000

    let preferenceUuidsGenerator: AsyncGenerator<string[]>
    if (isNewCategory) {
      preferenceUuidsGenerator = this.repo
        .findAllPreferenceUuids(defaultChannels, batchSize)
    } else {
      preferenceUuidsGenerator = this.repo.findUserPreferencesAlreadySubscribedToCategory(
        notificationCategory(type),
        defaultChannels,
        batchSize
      )
    }

    for await (const preferenceUuids of preferenceUuidsGenerator) {
      await this.repo.enableNotificationTypeFor(preferenceUuids, type)
    }
  }
}
