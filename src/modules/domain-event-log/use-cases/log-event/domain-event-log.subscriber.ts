import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { trace } from '@opentelemetry/api'
import { DomainEventLog } from '../../domain-event-log.entity.js'
import { AuthContext } from '../../../auth/auth.context.js'
import { DomainEvent } from '../../../domain-events/domain-event.js'
import { SubscribeToAll } from '../../../domain-events/subscribe-all.decorator.js'
import { DomainEventLogEntityBuilder } from '../../domain-event-log.entity.builder.js'

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
      const log = new DomainEventLogEntityBuilder()
        .withUuid(event.id)
        .withCreatedAt(event.createdAt)
        .withSource(event.source)
        .withType(event.type)
        .withVersion(event.version)
        .withContent(event.content)
        .withSubjectType(event.subjectType)
        .withSubjectId(event.subjectId)
        .withUserUuid(this.authContext.getUserUuid())
        .withTraceId(span?.spanContext().traceId ?? null)
        .build()
      logs.push(log)
    }

    await this.eventLog.insert(logs)
  }
}
