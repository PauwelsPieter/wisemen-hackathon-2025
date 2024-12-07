/* eslint-disable no-console */
import { captureException } from '@sentry/nestjs'
import colors from 'colors'
import { PgBossClient } from '../client/pgboss-client.js'
import { JobRegistry } from '../jobs/job.registry.js'
import { RawPgBossJob } from './constants.js'

export type PgBossJobGenerator = AsyncGenerator<RawPgBossJob, void, unknown>

export class PgBossWorkerThread {
  constructor (
    private readonly queue: PgBossJobGenerator,
    private readonly client: PgBossClient,
    private readonly jobRegistry: JobRegistry
  ) {}

  async run (): Promise<void> {
    for await (const job of this.queue) {
      try {
        const result = await this.handleJob(job)

        await this.client.complete(job.name, job.id, result ?? undefined)
      } catch (error) {
        // todo: what if this fails, is a worker thread broken then???
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        await this.client.fail(job.name, job.id, { error })
      }
    }
  }

  private async handleJob (
    job: RawPgBossJob
  ): Promise<unknown> {
    const startedAt = Date.now()

    try {
      const jobInstance = this.jobRegistry.get(job.data.className)

      const result = await jobInstance.run(job.data.classData)

      const executionTime = Date.now() - startedAt

      console.info(colors.blue(job.data.className), 'succeeded', `(${executionTime}ms)`)

      return result
    } catch (e) {
      const executionTime = Date.now() - startedAt

      if (e instanceof Error) {
        console.error(
          colors.blue(job.data.className),
          'failed with error:',
          colors.red(`${e.name}: ${e.message}`),
          `(${executionTime}ms)`
        )
      }

      captureException(e)

      throw e
    }
  }
}
