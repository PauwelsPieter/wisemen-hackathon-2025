import { Injectable } from '@nestjs/common'
import { DomainEvent } from '../../domain-events/domain-event.js'
import { CloudEvent } from './cloud-event.js'
import { NatsOutboxEvent } from './nats-outbox-event.js'

@Injectable()
export class NatsOutboxEventMapper {
  map (event: DomainEvent): NatsOutboxEvent {
    return {
      topic: event.topic,
      serializedMessage: JSON.stringify(this.mapToCloudEvent(event))
    }
  }

  private mapToCloudEvent (event: DomainEvent): CloudEvent {
    return {
      id: event.id,
      contentType: 'application/json',
      specVersion: `v${event.version.toString()}`,
      time: event.createdAt.toISOString(),
      source: event.source,
      type: event.type,
      data: event.content
    }
  }
}
