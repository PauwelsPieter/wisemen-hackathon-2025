import { BaseJobConfig } from '../../../pgboss/jobs/job.abstract.js'
import { PgBossJob } from '../../../pgboss/jobs/job.decorator.js'
import { QueueName } from '../../../pgboss/queue-name.enum.js'

@PgBossJob(QueueName.TYPESENSE)
export class ImportTypesenseJob extends BaseJobConfig {
  uniqueBy (): string {
    return 'import-typesense'
  }
}
