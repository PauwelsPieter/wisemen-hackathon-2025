import { BaseJobConfig, PgBossJob } from '@wisemen/pgboss-nestjs-job'
import { QueueName } from '../../../pgboss/enums/queue-name.enum.js'

@PgBossJob(QueueName.TYPESENSE)
export class ImportTypesenseJob extends BaseJobConfig {
  uniqueBy (): string {
    return 'import-typesense'
  }
}
