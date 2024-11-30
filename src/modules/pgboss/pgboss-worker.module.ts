import { type DynamicModule, Module } from '@nestjs/common'
import { PgBossWorker } from './worker/pgboss-worker.js'
import { PgBossModule } from './pgboss.module.js'
import { PgBossWorkerConfig } from './worker/pgboss-worker.config.js'

@Module({})
export class PgBossWorkerModule {
  static forRoot (config: PgBossWorkerConfig): DynamicModule {
    return {
      module: PgBossWorkerModule,
      imports: [
        PgBossModule.forRoot()
      ],
      providers: [
        {
          provide: 'PG_BOSS_WORKER_CONFIG',
          useValue: config
        },
        PgBossWorker
      ]
    }
  }
}
