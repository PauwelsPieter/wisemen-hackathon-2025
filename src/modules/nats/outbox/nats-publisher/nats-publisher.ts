import { Injectable } from '@nestjs/common'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { IntegrationEvent } from '../../../integration-events/integration-event.js'
import { PublishNatsEventJob } from '../publish-nats-event/publish-nats-event.job.js'

export type IntegrationEventWithSubject = {
  event: IntegrationEvent
  onSubject: string
}

@Injectable()
export class NatsPublisher {
  constructor (
    private readonly jobScheduler: PgBossScheduler
  ) {}

  /** Publishes the event asynchronously in a job */
  async publish (event: IntegrationEvent, onSubject: string): Promise<void>
  async publish (event: IntegrationEvent[], onSubject: string): Promise<void>
  async publish (events: IntegrationEventWithSubject[]): Promise<void>
  async publish (
    events: IntegrationEvent[] | IntegrationEvent | IntegrationEventWithSubject[],
    onSubject?: string
  ): Promise<void> {
    if (!Array.isArray(events)) {
      events = [events]
    }

    const jobs: PublishNatsEventJob[] = []
    for (const event of events) {
      let job: PublishNatsEventJob
      if ('onSubject' in event) {
        const message = JSON.stringify(event.event)
        job = new PublishNatsEventJob({ subject: event.onSubject, serializedMessage: message })
      } else {
        job = new PublishNatsEventJob({
          subject: onSubject!,
          serializedMessage: JSON.stringify(event)
        })
      }
      jobs.push(job)
    }

    await this.jobScheduler.scheduleJobs(jobs)
  }
}
