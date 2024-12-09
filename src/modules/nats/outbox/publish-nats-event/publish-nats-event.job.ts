import { BaseJobConfig } from '../../../pgboss/jobs/job.abstract.js'
import type { NatsOutboxEvent } from '../nats-outbox-event.js'

export class PublishNatsEventJob extends BaseJobConfig<NatsOutboxEvent> {}
