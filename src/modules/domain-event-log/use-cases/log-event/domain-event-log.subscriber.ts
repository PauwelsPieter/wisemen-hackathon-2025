import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { trace } from '@opentelemetry/api'
import { DomainEventLog } from '../../domain-event-log.entity.js'
import { AuthContext } from '../../../auth/auth.context.js'
import { DomainEvent } from '../../../domain-events/domain-event.js'
import { SubscribeToAll } from '../../../domain-events/subscribe-all.decorator.js'

@Injectable()
export class DomainEventLogSubscriber {
  constructor (
    private readonly authContext: AuthContext,
    @InjectRepository(DomainEventLog) private readonly eventLog: Repository<DomainEventLog>
  ) {}

  @SubscribeToAll()
  async handle (event: DomainEvent): Promise<void> {
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
