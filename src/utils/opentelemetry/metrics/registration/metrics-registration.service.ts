import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { Attributes, metrics, ObservableResult } from '@opentelemetry/api'

@Injectable()
export class MetricsRegistrationService {
  constructor (
    private readonly dataSource: DataSource
  ) {
    this.registerPgBossMetrics()
  }

  private registerPgBossMetrics (): void {
    const meter = metrics.getMeterProvider().getMeter('pg_boss_jobs')

    meter.createObservableGauge('pg_boss_jobs_count', {
      description: 'Tracks the number of PgBoss jobs by state and name'
    })
      .addCallback(async (observableResult) => {
        await this.updatePgBossMetrics(observableResult)
      })
  }

  async updatePgBossMetrics (observer: ObservableResult<Attributes>): Promise<void> {
    try {
      const result: { name: string, state: string, count: number }[]

        = await this.dataSource
          .query(`
            SELECT 
              job.state, 
              job.name, 
              COUNT(job.id)::int as count 
            FROM pgboss.job 
            GROUP BY job.name, job.state
          `)

      result.forEach((row) => {
        const { name, state, count } = row

        observer.observe(count, { job_name: name, job_state: state })
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating pg boss job metrics:', error)
    }
  }
}
