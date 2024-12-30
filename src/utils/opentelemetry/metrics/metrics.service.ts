import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Attributes, metrics, ObservableResult } from '@opentelemetry/api'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Job } from '../../../modules/pgboss/persistence/job.entity.js'

@Injectable()
export class MetricsService {
  constructor (
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job<unknown>>
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
      const result: { name: string, state: string, count: string }[]
        = await this.jobRepository
          .createQueryBuilder('job')
          .select('job.state', 'state')
          .addSelect('job.name', 'name')
          .addSelect('COUNT(job.id)', 'count')
          .groupBy('job.name')
          .addGroupBy('job.state')
          .getRawMany()

      result.forEach((row) => {
        const { name, state, count } = row
        const countValue = parseInt(count, 10)

        observer.observe(countValue, { job_name: name, job_state: state })
      })
    } catch (error) {
      console.error('Error updating pg boss job metrics:', error)
    }
  }
}
