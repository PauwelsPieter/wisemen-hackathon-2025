import { Injectable } from '@nestjs/common'
import { TypesenseCollectionName } from '../../enums/typesense-collection-index.enum.js'
import { TypesenseInitializationService } from '../../services/typesense-initialization.service.js'
import { BaseJobHandler } from '../../../pgboss/jobs/job.abstract.js'
import { QueueName } from '../../../pgboss/queue-name.enum.js'
import { PgBossJobHandler } from '../../../pgboss/jobs/job.decorator.js'
import { ImportTypesenseJob } from './import-typesense.job.js'

@Injectable()
@PgBossJobHandler(QueueName.TYPESENSE, ImportTypesenseJob)
export class ImportTypesenseJobHandler extends BaseJobHandler {
  constructor (
    private readonly typesense: TypesenseInitializationService
  ) {
    super()
  }

  async run (): Promise<void> {
    await this.typesense.migrate(true, Object.values(TypesenseCollectionName))
    await this.typesense.import(Object.values(TypesenseCollectionName))
  }
}
