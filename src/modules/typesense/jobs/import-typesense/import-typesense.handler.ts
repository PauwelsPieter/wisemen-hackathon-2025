import { Injectable } from '@nestjs/common'
import { BaseJobHandler, PgBossJobHandler } from '@wisemen/pgboss-nestjs-job'
import { TypesenseCollectionName } from '../../enums/typesense-collection-index.enum.js'
import { TypesenseInitializationService } from '../../services/typesense-initialization.service.js'
import { ImportTypesenseJob } from './import-typesense.job.js'

@Injectable()
@PgBossJobHandler(ImportTypesenseJob)
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
