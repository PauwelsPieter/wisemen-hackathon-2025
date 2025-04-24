import { ApiProperty } from '@nestjs/swagger'
import { OneOfMeta } from '@wisemen/one-of'
import { DomainEvent } from '../../../domain-events/domain-event.js'
import { RegisterDomainEvent } from '../../../domain-events/register-domain-event.decorator.js'
import { DomainEventType } from '../../../domain-events/domain-event-type.js'
import { DomainEventLog } from '../../../domain-event-log/domain-event-log.entity.js'

@OneOfMeta(DomainEventLog, DomainEventType.TEST_NOTIFICATION_SENT)
export class TestNotificationSentEventContent {
  @ApiProperty({ type: 'string' })
  message: string

  constructor (message: string) {
    this.message = message
  }
}

@RegisterDomainEvent(DomainEventType.TEST_NOTIFICATION_SENT, 1)
export class TestNotificationSentEvent extends DomainEvent<TestNotificationSentEventContent> {
  constructor (message: string) {
    super({ content: new TestNotificationSentEventContent(message) })
  }
}
