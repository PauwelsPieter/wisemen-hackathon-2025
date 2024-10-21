import { captureException } from '@sentry/node'
import { captureError } from 'rxjs/internal/util/errorContext'
import { CompletedJob } from '../jobs/pgboss.job.js'
import { JobFactory } from '../jobs/job-factory.js'
import { PgBossClient } from '../pgboss-client.js'
import { DUPLICATE_SINGLETON_ERROR_MESSAGE } from './constants.js'

export type PgBossCompletedJobGenerator = AsyncGenerator<CompletedJob, void, unknown>

export class PgBossOnCompleteWorkerThread {
  constructor (
    private readonly queue: PgBossCompletedJobGenerator,
    private readonly client: PgBossClient
  ) {}

  async run (): Promise<void> {
    for await (const job of this.queue) {
      try {
        await this.handleCompletedJob(job)
        await this.client.complete(job.id)
      } catch (error) {
        await this.failJob(job, error as Error)
      }
    }
  }

  private async handleCompletedJob (job: CompletedJob): Promise<void> {
    try {
      const serializedJob = job.data.request.data
      const jobInstance = JobFactory.make(serializedJob)

      await jobInstance.onComplete(job)
    } catch (e) {
      captureException(e)

      throw e
    }
  }

  private async failJob (job: CompletedJob, error: Error): Promise<void> {
    try {
      await this.client.fail(job.id, error)
    } catch (error) {
      if (error instanceof Error && error.message === DUPLICATE_SINGLETON_ERROR_MESSAGE) {
        await this.client.cancel(job.id)
      } else {
        captureError(error)
      }
    }
  }
}
