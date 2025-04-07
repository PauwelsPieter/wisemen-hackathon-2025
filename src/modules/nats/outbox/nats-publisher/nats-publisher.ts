import { Injectable } from '@nestjs/common'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { IntegrationEvent } from '../../../integration-events/integration-event.js'
import { PublishNatsEventJob } from '../publish-nats-event/publish-nats-event.job.js'

@Injectable()
export class NatsPublisher {
  constructor (
    private readonly jobScheduler: PgBossScheduler
  ) {}

  /** Publishes the event asynchronously in a job */
  async publish (event: IntegrationEvent, onTopic: string): Promise<void>
  async publish (event: IntegrationEvent[], onTopic: string): Promise<void>
  async publish (events: IntegrationEvent[] | IntegrationEvent, onTopic: string): Promise<void> {
    if (!Array.isArray(events)) {
      events = [events]
    }

    const jobs: PublishNatsEventJob[] = []
    for (const event of events) {
      jobs.push(new PublishNatsEventJob({
        topic: onTopic,
        serializedMessage: JSON.stringify(event)
      }))
    }

    await this.jobScheduler.scheduleJobs(jobs)
  }
}
