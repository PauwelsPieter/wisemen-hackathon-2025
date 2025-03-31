import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { trace } from '@opentelemetry/api'
import { EventLog } from '../../event-log.entity.js'
import { AuthContext } from '../../../auth/auth.context.js'
import { WiseEvent } from '../../../events/wise-event.js'
import { SubscribeToAll } from '../../../events/subscribe-all.decorator.js'

@Injectable()
export class EventLogSubscriber {
  constructor (
    private readonly authContext: AuthContext,
    @InjectRepository(EventLog) private readonly eventLog: Repository<EventLog>
  ) {}

  @SubscribeToAll()
  async handle (event: WiseEvent): Promise<void> {
    const span = trace.getActiveSpan()

    await this.eventLog.insert({
      uuid: event.id,
      createdAt: event.createdAt,
      source: event.source,
      topic: event.topic,
      type: event.type,
      version: event.version,
      content: event.content,
      userUuid: this.authContext.getUserUuid(),
      traceId: span?.spanContext().traceId ?? null
    })
  }
}
