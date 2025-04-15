import { Injectable } from '@nestjs/common'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { IntegrationEvent } from '../../../integration-events/integration-event.js'
import { PublishNatsEventJob } from '../publish-nats-event/publish-nats-event.job.js'

export type IntegrationEventWithTopic = {
  event: IntegrationEvent
  onTopic: string
}

@Injectable()
export class NatsPublisher {
  constructor (
    private readonly jobScheduler: PgBossScheduler
  ) {}

  /** Publishes the event asynchronously in a job */
  async publish (event: IntegrationEvent, onTopic: string): Promise<void>
  async publish (event: IntegrationEvent[], onTopic: string): Promise<void>
  async publish (events: IntegrationEventWithTopic[]): Promise<void>
  async publish (
    events: IntegrationEvent[] | IntegrationEvent | IntegrationEventWithTopic[],
    onTopic?: string
  ): Promise<void> {
    if (!Array.isArray(events)) {
      events = [events]
    }

    const jobs: PublishNatsEventJob[] = []
    for (const event of events) {
      let job: PublishNatsEventJob
      if ('onTopic' in event) {
        const message = JSON.stringify(event.event)
        job = new PublishNatsEventJob({ topic: event.onTopic, serializedMessage: message })
      } else {
        job = new PublishNatsEventJob({ topic: onTopic!, serializedMessage: JSON.stringify(event) })
      }
      jobs.push(job)
    }

    await this.jobScheduler.scheduleJobs(jobs)
  }
}
