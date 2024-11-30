import type { DynamicModule } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { ArchivedJob } from './persistence/archive.entity.js'
import { Job } from './persistence/job.entity.js'
import { JobFactory } from './jobs/job-factory.js'
import type { JobConstructor } from './jobs/pgboss.job.js'
import { PgBossClient } from './pgboss-client.js'
import { PgBossScheduler } from './pgboss-scheduler.js'

export class PgBossModule {
  static forRoot (): DynamicModule {
    return {
      module: PgBossModule,
      imports: [
        TypeOrmModule.forFeature([Job, ArchivedJob])
      ],
      providers: [
        PgBossClient,
        PgBossScheduler
      ],
      exports: [PgBossScheduler, PgBossClient]
    }
  }

  static forFeature (jobs: Array<JobConstructor<unknown>>): DynamicModule {
    jobs.forEach((job) => {
      JobFactory.register(job)
    })

    return this.forRoot()
  }
}
