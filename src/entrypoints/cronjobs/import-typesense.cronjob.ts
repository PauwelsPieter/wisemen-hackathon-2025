import '../../utils/sentry/sentry.js'

import { DataSource } from 'typeorm'
import { INestApplicationContext } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { JobContainer } from '@wisemen/app-container'
import { transaction } from '@wisemen/nestjs-typeorm'
import { AppModule } from '../../app.module.js'
import { ImportTypesenseJobHandler } from '../../modules/typesense/jobs/import-typesense/import-typesense.job.js'
import { PgBossScheduler } from '../../modules/pgboss/scheduler/pgboss-scheduler.service.js'

export class ImportTypesenseCronjob extends JobContainer {
  async bootstrap (): Promise<INestApplicationContext> {
    return await NestFactory.createApplicationContext(
      AppModule.forRoot([])
    )
  }

  async execute (app: INestApplicationContext): Promise<void> {
    const scheduler = app.get(PgBossScheduler)
    const dataSource = app.get(DataSource)

    await transaction(dataSource, async () => {
      await scheduler.scheduleJob(ImportTypesenseJobHandler, {})
    })
  }
}

const _importTypesenseCronjob = new ImportTypesenseCronjob()
