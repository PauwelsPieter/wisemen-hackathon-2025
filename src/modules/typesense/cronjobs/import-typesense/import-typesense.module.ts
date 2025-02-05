import { Module } from '@nestjs/common'
import { PgBossSchedulerModule } from '@wisemen/pgboss-nestjs-job'
import { ImportTypesenseUseCase } from './import-typesense.use-case.js'

@Module({
  imports: [
    PgBossSchedulerModule
  ],
  providers: [ImportTypesenseUseCase],
  exports: [ImportTypesenseUseCase]
})
export class ImportTypesenseModule {}
