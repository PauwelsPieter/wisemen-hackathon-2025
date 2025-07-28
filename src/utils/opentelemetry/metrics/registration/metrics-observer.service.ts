/* eslint-disable no-console */
import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { Attributes, metrics, ObservableResult } from '@opentelemetry/api'
import { QueueName } from '../../../../modules/pgboss/enums/queue-name.enum.js'

type QueueJobCount = {
  name: string
  state: string
  count: number
}

@Injectable()
export class MetricsObserverService {
  private readonly PG_BOSS_JOB_STATES = [
    'created',
    'active',
    'completed',
    'retry',
    'failed'
  ]

  private readonly QUEUE_NAMES = Object.values(QueueName)

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
        await this.observePgBossJobsCount(observableResult)
      })

    meter.createObservableGauge('pg_boss_jobs_waiting_seconds', {
      description: 'Tracks the number of seconds jobs have been waiting'
    })
      .addCallback(async (observableResult) => {
        await this.observePgBossJobsWaitingSeconds(observableResult)
      })
  }

  async observePgBossJobsCount (observer: ObservableResult<Attributes>): Promise<void> {
    try {
      const result: QueueJobCount[]
        = await this.dataSource
          .query(`
            SELECT 
              job.state, 
              job.name, 
              COUNT(job.id)::int as count 
            FROM pgboss.job 
            GROUP BY job.name, job.state
          `)

      const jobCountsMap: Record<string, Record<string, number>> = {}

      for (const { name, state, count } of result) {
        if (jobCountsMap[name] === undefined) {
          jobCountsMap[name] = {}
        }
        jobCountsMap[name][state] = count
      }

      for (const [name, stateCounts] of Object.entries(jobCountsMap)) {
        for (const state of this.PG_BOSS_JOB_STATES) {
          const count = stateCounts[state] ?? 0
          observer.observe(count, { job_name: name, job_state: state })
        }
      }
    } catch (error) {
      console.error('Error updating pg boss job metrics:', error)
    }
  }

  async observePgBossJobsWaitingSeconds (observer: ObservableResult<Attributes>): Promise<void> {
    try {
      const result: { name: string, waiting_seconds: number }[]
        = await this.dataSource
          .query(`
            SELECT name, EXTRACT(EPOCH FROM (now() - MIN(start_after)))::integer as waiting_seconds
            FROM pgboss.job
            WHERE state = 'created' AND start_after <= now()
            group by name
          `)

      const jobWaitingSecondsMap: Record<string, number> = {}
      for (const { name, waiting_seconds } of result) {
        jobWaitingSecondsMap[name] = waiting_seconds
      }

      for (const name of this.QUEUE_NAMES) {
        const waitingSeconds = jobWaitingSecondsMap[name] ?? 0
        observer.observe(waitingSeconds, { job_name: name })
      }
    } catch (error) {
      console.error('Error updating pg boss job metrics:', error)
    }
  }
}
