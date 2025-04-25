import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { transaction } from '@wisemen/nestjs-typeorm'

import { NotificationChannel } from '../../../notification/enums/notification-channel.enum.js'
import {
  NotificationPreferences
} from '../../../notification/entities/notification-preferences.entity.js'

import { NotificationPreferencesEntityBuilder } from '../../../notification/entity-builders/notification-preferences.entity.builder.js'

import { NotificationPreset } from '../../../notification/enums/notification-preset.enum.js'
import { DomainEventEmitter } from '../../../domain-events/domain-event-emitter.js'
import { getDefaultTypesOfChannel } from '../../notification-types-config.js'
import { UserUuid } from '../../../../app/users/entities/user.uuid.js'
import { UserNotFoundError } from '../../../../app/users/errors/user-not-found.error.js'
import { NotificationPreferencesPresetEntityBuilder } from '../../entity-builders/notification-preferences-preset.entity.builder.js'
import {
  AssignDefaultNotificationPreferencesToUserRepository
} from './assign-default-notification-preferences-to-user.repository.js'
import {
  DefaultNotificationPreferencesAssignedToUserEvent
} from './default-notification-preferences-assigned-to-user.event.js'

@Injectable()
export class AssignDefaultNotificationPreferencesToUserUseCase {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private readonly repository: AssignDefaultNotificationPreferencesToUserRepository
  ) {}

  async assignDefaultPreferences (forUserUuid: UserUuid): Promise<void> {
    if (!await this.repository.userExists(forUserUuid)) {
      throw new UserNotFoundError(forUserUuid)
    }

    const defaultPreferences = this.createDefaultPreferences(forUserUuid)
    const event = new DefaultNotificationPreferencesAssignedToUserEvent(forUserUuid)
    const defaultPreset = new NotificationPreferencesPresetEntityBuilder()
      .withUserUuid(forUserUuid)
      .withPreset(NotificationPreset.DEFAULT)
      .build()

    await transaction(this.dataSource, async () => {
      await this.repository.savePreferences(defaultPreferences)
      await this.repository.savePreset(defaultPreset)
      await this.eventEmitter.emitOne(event)
    })
  }

  private createDefaultPreferences (forUserUuid: UserUuid): NotificationPreferences[] {
    const channels = Object.values(NotificationChannel)
    const defaultPreferences: NotificationPreferences[] = []

    for (const channel of channels) {
      const defaultTypesForChannel = getDefaultTypesOfChannel(channel)

      const newNotificationPreference = new NotificationPreferencesEntityBuilder()
        .withUserUuid(forUserUuid)
        .withChannel(channel)
        .withTypes(defaultTypesForChannel)
        .build()

      defaultPreferences.push(newNotificationPreference)
    }

    return defaultPreferences
  }
}
