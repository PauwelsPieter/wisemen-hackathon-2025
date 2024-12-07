/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common'
import { ConnectionOptions, JobInsert } from 'pg-boss'
import { EntityManager } from 'typeorm'
import { createTransactionManagerProxy, InjectEntityManager } from '@wisemen/nestjs-typeorm'
import { Reflector } from '@nestjs/core'
import { PgBossClient } from '../client/pgboss-client.js'
import { BaseJobData, BaseJobHandler } from '../jobs/job.abstract.js'
import { PGBOSS_JOB_HANDLER, PGBOSS_QUEUE_NAME } from '../jobs/job.decorator.js'

type Constructor<S extends BaseJobData = never> =
  (abstract new (...args: any[]) => BaseJobHandler<S>)
  & { uniqueBy?: (data?: BaseJobData) => string }

@Injectable()
export class PgBossScheduler {
  private readonly manager: EntityManager

  constructor (
    private readonly boss: PgBossClient,
    private readonly reflector: Reflector,
    @InjectEntityManager() entityManager: EntityManager
  ) {
    this.manager = createTransactionManagerProxy(entityManager)
  }

  async scheduleJob<D extends BaseJobData, H extends Constructor<D>>(
    handler: H,
    ...data: D extends never ? [] : [D]
  ): Promise<void> {
    const queue = this.reflector.get<string>(PGBOSS_QUEUE_NAME, handler)
    const className = this.reflector.get<string>(PGBOSS_JOB_HANDLER, handler)

    const uniqueBy = handler.uniqueBy?.(data[0])

    const job: JobInsert<H> | JobInsert = {
      name: queue,
      data: {
        className,
        classData: data[0]
      },
      singletonKey: uniqueBy
    }

    await this.scheduleJobs([job])
  }

  public async scheduleJobs <T extends object> (
    jobs: JobInsert<T>[] | JobInsert[]
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

    await this.boss.insert(jobs, options)
  }
}
