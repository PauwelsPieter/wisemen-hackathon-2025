import { Injectable } from '@nestjs/common'
import type { EntityManager } from 'typeorm'
import { ConnectionOptions } from 'pg-boss'
import { createTransactionManagerProxy, InjectEntityManager } from '@wisemen/nestjs-typeorm'
import type { PgBossJob } from './jobs/pgboss.job.js'
import { PgBossClient } from './pgboss-client.js'

@Injectable()
export class PgBossScheduler {
  private readonly manager: EntityManager

  constructor (
    private readonly boss: PgBossClient,
    @InjectEntityManager() entityManager: EntityManager
  ) {
    this.manager = createTransactionManagerProxy(entityManager)
  }

  public async scheduleJob<T extends PgBossJob>(job: T): Promise<void> {
    await this.scheduleJobs([job])
  }

  public async scheduleJobs <T extends PgBossJob> (
    jobs: T[]
  ): Promise<void> {
    const manager = this.manager
    const options: ConnectionOptions = {
      db: {
        async executeSql (text, values) {
          const result = await manager.query<object[]>(text, values)

          return {
            rows: result,
            rowCount: result.length
          }
        }
      }
    }

    await this.boss.insert(jobs.map(job => job.serialize()), options)
  }
}
