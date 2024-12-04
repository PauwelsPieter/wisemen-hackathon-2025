import { captureException } from '@sentry/nestjs'
import { ModuleRef } from '@nestjs/core'
import { captureError } from 'rxjs/internal/util/errorContext'
import { JobFactory } from '../jobs/job-factory.js'
import { PgBossClient } from '../pgboss-client.js'
import { RawPgBossJob } from './raw-pgboss-job.js'
import { DUPLICATE_SINGLETON_ERROR_MESSAGE } from './constants.js'

export type PgBossJobGenerator = AsyncGenerator<RawPgBossJob, void, unknown>

export class PgBossWorkerThread {
  constructor (
    private readonly queue: PgBossJobGenerator,
    private readonly client: PgBossClient,
    private readonly moduleRef: ModuleRef
  ) {}

  async run (): Promise<void> {
    for await (const job of this.queue) {
      try {
        const result = await this.handleJob(job)

        await this.client.complete(job.name, job.id, result ?? undefined)
      } catch (error) {
        await this.failJob(job, error as Error)
      }
    }
  }

  private async handleJob (
    job: RawPgBossJob
  ): Promise<unknown> {
    try {
      const jobInstance = JobFactory.make(job.data)

      return await jobInstance.execute(this.moduleRef)
    } catch (e) {
      captureException(e)

      throw e
    }
  }

  private async failJob (job: RawPgBossJob, error: Error): Promise<void> {
    try {
      await this.client.fail(job.name, job.id, error)
    } catch (error) {
      if (error instanceof Error && error.message === DUPLICATE_SINGLETON_ERROR_MESSAGE) {
        await this.client.cancel(job.name, job.id)
      } else {
        captureError(error)
      }
    }
  }
}
