import { BaseJobConfig } from '../../../pgboss/jobs/job.abstract.js'

export class ImportTypesenseJob extends BaseJobConfig {
  uniqueBy (): string {
    return 'import-typesense'
  }
}
