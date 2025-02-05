import { Injectable } from '@nestjs/common'
import { transaction } from '@wisemen/nestjs-typeorm'
import { DataSource } from 'typeorm'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { ImportTypesenseJob } from '../../../typesense/jobs/import-typesense/import-typesense.job.js'
import { AbstractUseCase } from '../../../cronjobs/types/abstract-use-case.js'

@Injectable()
export class ImportTypesenseUseCase implements AbstractUseCase {
  constructor (
    private readonly dataSource: DataSource,
    private readonly scheduler: PgBossScheduler
  ) {}

  async execute (): Promise<void> {
    await transaction(this.dataSource, async () => {
      const job = new ImportTypesenseJob()

      await this.scheduler.scheduleJob(job)
    })
  }
}
