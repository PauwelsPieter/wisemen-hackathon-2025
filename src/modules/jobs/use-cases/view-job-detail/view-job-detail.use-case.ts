import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@wisemen/nestjs-typeorm'
import { EntityManager } from 'typeorm'
import { ViewJobDetailResponse } from './view-job-detail.response.js'
import { ViewJobDetailJob } from './view-job-detail.job.type.js'
import { JobNotFoundError } from './job-not-found.api-error.js'

@Injectable()
export class ViewJobDetailUseCase {
  constructor (
    @InjectEntityManager() private readonly entityManager: EntityManager
  ) {}

  async execute (jobId: string, isArchived: boolean): Promise<ViewJobDetailResponse> {
    const job = await this.entityManager.createQueryBuilder()
      .select([
        'id',
        'name as "queueName"',
        'priority',
        'data->>\'className\' AS "name"',
        'data->>\'classData\' AS "data"',
        'state AS "status"',
        'retry_limit AS "retryLimit"',
        'retry_count AS "retryCount"',
        'retry_delay AS "retryDelay"',
        'retry_backoff AS "retryBackoff"',
        'start_after AS "startAfter"',
        'started_on AS "startedAt"',
        'singleton_key AS "singletonKey"',
        'singleton_on AS "singletonOn"',
        'expire_in AS "expireIn"',
        'created_on AS "createdAt"',
        'completed_on AS "completedAt"',
        'keep_until AS "keepUntil"',
        'output',
        'dead_letter AS "deadLetter"',
        'policy'
      ])
      .from(this.getTableName(isArchived), 'job')
      .where('job.id = :jobId', { jobId })
      .getRawOne<ViewJobDetailJob>()

    if (job === undefined) {
      throw new JobNotFoundError()
    }

    return new ViewJobDetailResponse(job)
  }

  getTableName (isArchived: boolean): string {
    return isArchived ? 'pgboss.archive' : 'pgboss.job'
  }
}
