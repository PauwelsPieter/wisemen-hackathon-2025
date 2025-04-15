import { Injectable } from '@nestjs/common'
import { InjectRepository, transaction } from '@wisemen/nestjs-typeorm'
import { DataSource, Repository } from 'typeorm'
import { NotificationPreferencesPreset } from '../../entities/notification-preferences-preset.entity.js'
import { AuthContext } from '../../../auth/auth.context.js'
import { DomainEventEmitter } from '../../../domain-events/domain-event-emitter.js'
import { UpdateMyNotificationPreferencePresetCommand } from './update-my-notification-preference-preset.command.js'
import { NotificationPreferencePresetUpdatedEvent } from './notification-preference-preset-updated.event.js'

@Injectable()
export class UpdateNotificationPresetPreferenceUseCase {
  constructor (
    private readonly datasource: DataSource,
    @InjectRepository(NotificationPreferencesPreset)
    private readonly notificationPresetPreference: Repository<NotificationPreferencesPreset>,
    private readonly authContext: AuthContext,
    private readonly eventEmitter: DomainEventEmitter
  ) {}

  async execute (
    command: UpdateMyNotificationPreferencePresetCommand
  ): Promise<void> {
    const userUuid = this.authContext.getUserUuidOrFail()

    await transaction(this.datasource, async () => {
      await this.notificationPresetPreference.upsert(
        { userUuid, preset: command.preset },
        { conflictPaths: { userUuid: true } }
      )
      await this.eventEmitter.emitOne(
        new NotificationPreferencePresetUpdatedEvent(userUuid, command.preset)
      )
    })
  }
}
