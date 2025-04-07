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
  async handle (events: DomainEvent[]): Promise<void> {
    const span = trace.getActiveSpan()
    const logs: DomainEventLog[] = []

    for (const event of events) {
      logs.push(this.eventLog.create({
        uuid: event.id,
        createdAt: event.createdAt,
        source: event.source,
        type: event.type,
        version: event.version,
        content: event.content,
        userUuid: this.authContext.getUserUuid(),
        traceId: span?.spanContext().traceId ?? null
      }))
    }

    await this.eventLog.insert(logs)
  }
}
