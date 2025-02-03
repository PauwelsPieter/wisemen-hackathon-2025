import { BaseJobData } from '@wisemen/pgboss-nestjs-job'

export interface NatsOutboxEvent extends BaseJobData {
  topic: string
  serializedMessage: string
}
