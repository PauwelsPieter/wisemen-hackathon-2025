import { BaseJobData } from '../../pgboss/jobs/job.abstract.js'

export interface NatsOutboxEvent extends BaseJobData {
  topic: string
  serializedMessage: string
}
