import { BaseJob, PgBossJob } from '@wisemen/pgboss-nestjs-job'
import { QueueName } from '../../../pgboss/enums/queue-name.enum.js'

@PgBossJob(QueueName.SYSTEM)
export class ImportTypesenseJob extends BaseJob {
  uniqueBy (): string {
    return 'import-typesense'
  }
}
