import '../utils/sentry/sentry.js'

import { DataSource } from 'typeorm'
import { INestApplicationContext } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { JobContainer } from '@wisemen/app-container'
import { transaction } from '@wisemen/nestjs-typeorm'
import { PgBossScheduler } from '../../modules/pgboss/pgboss-scheduler.js'
import { ImportTypesenseJob } from '../../modules/typesense/jobs/import-typesense.job.js'
import { AppModule } from '../../app.module.js'
import { TypesenseModule } from '../../modules/typesense/modules/typesense.module.js'

export class ImportTypesenseCronjob extends JobContainer {
  async bootstrap (): Promise<INestApplicationContext> {
    return await NestFactory.createApplicationContext(
      AppModule.forRoot([
        TypesenseModule
      ])
    )
  }

  async execute (app: INestApplicationContext): Promise<void> {
    const scheduler = app.get(PgBossScheduler)
    const dataSource = app.get(DataSource)

    const job = ImportTypesenseJob.create()

    await transaction(dataSource, async () => {
      await scheduler.scheduleJobs([job])
    })
  }
}

const _importTypesenseCronjob = new ImportTypesenseCronjob()
