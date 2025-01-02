import { Module } from '@nestjs/common'
import { PgBossSchedulerModule } from '../../../pgboss/scheduler/pgboss-scheduler.module.js'
import { ImportTypesenseUseCase } from './import-typesense.use-case.js'

@Module({
  imports: [
    PgBossSchedulerModule
  ],
  providers: [ImportTypesenseUseCase],
  exports: [ImportTypesenseUseCase]
})
export class ImportTypesenseModule {}
