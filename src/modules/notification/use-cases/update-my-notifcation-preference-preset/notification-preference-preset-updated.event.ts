import { ApiProperty } from '@nestjs/swagger'
import { OneOfMeta } from '@wisemen/one-of'
import { NotificationPreset, NotificationPresetApiProperty } from '../../enums/notification-preset.enum.js'
import { DomainEventLog } from '../../../domain-event-log/domain-event-log.entity.js'
import { DomainEventType } from '../../../domain-events/domain-event-type.js'
import { DomainEvent } from '../../../domain-events/domain-event.js'
import { RegisterDomainEvent } from '../../../domain-events/register-domain-event.decorator.js'

@OneOfMeta(DomainEventLog, DomainEventType.NOTIFICATION_PREFERENCE_PRESET_UPDATED)
export class NotificationPreferencePresetEventContent {
  @ApiProperty({ format: 'uuid' })
  readonly userUuid: string

  @NotificationPresetApiProperty()
  readonly preset: NotificationPreset

  constructor (userUuid: string, preset: NotificationPreset) {
    this.userUuid = userUuid
    this.preset = preset
  }
}

@RegisterDomainEvent(DomainEventType.NOTIFICATION_PREFERENCE_PRESET_UPDATED, 1)
export class NotificationPreferencePresetUpdatedEvent extends DomainEvent {
  constructor (userUuid: string, preset: NotificationPreset) {
    super({
      content: new NotificationPreferencePresetEventContent(userUuid, preset)
    })
  }
}
