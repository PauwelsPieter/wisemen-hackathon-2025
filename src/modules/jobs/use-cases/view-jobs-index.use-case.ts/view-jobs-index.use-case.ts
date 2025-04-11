import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@wisemen/nestjs-typeorm'
import { EntityManager, SelectQueryBuilder } from 'typeorm'
import { SortDirection } from '@wisemen/pagination'
import { DEFAULT_LIMIT } from '../../../typesense/builder/search-params.builder.js'
import { QueueName } from '../../../pgboss/enums/queue-name.enum.js'
import { toBoolean } from '../../../../utils/transformers/to-boolean.js'
import { ViewJobsIndexResponse } from './view-jobs-index.response.js'
import { ViewJobsIndexJob } from './view-jobs-index.job.type.js'
import { ViewJobsIndexQuery } from './query/view-jobs-index.query.js'

@Injectable()
export class ViewJobsIndexUseCase {
  constructor (
    @InjectEntityManager() private readonly manager: EntityManager
  ) {}

  async execute (query: ViewJobsIndexQuery): Promise<ViewJobsIndexResponse> {
    const queryBuilder = this.manager.createQueryBuilder()
      .select([
        'name AS "queueName"',
        'id',
        'data->>\'className\' AS "name"',
        'state AS "status"',
        'created_on AS "createdAt"',
        'completed_on AS "completedAt"'
      ])
      .from(this.getJobTable(query), 'job')
      .where('name IN (:...names)', { names: this.getQueueNames(query) })
      .orderBy('created_on', this.getSortDirection(query))
      .addOrderBy('id', this.getSortDirection(query))
      .limit(query.pagination?.limit ?? DEFAULT_LIMIT)

    this.addWhereForKeyset(query, queryBuilder)

    const jobs = await queryBuilder.getRawMany<ViewJobsIndexJob>()

    return new ViewJobsIndexResponse(jobs)
  }

  private addWhereForKeyset (
    query: ViewJobsIndexQuery,
    queryBuilder: SelectQueryBuilder<object>
  ): void {
    if (query.pagination?.key == null) {
      return
    }

    const operator = this.getSortDirection(query) === 'ASC' ? '>' : '<'
    const { createdAt, id } = query.pagination.key
    queryBuilder.andWhere(`(created_on, id) ${operator} (:createdAt, :id)`, { createdAt, id })
  }

  private getSortDirection (query: ViewJobsIndexQuery): 'ASC' | 'DESC' {
    return query.sort?.at(0)?.order === SortDirection.ASC ? 'ASC' : 'DESC'
  }

  private getQueueNames (query: ViewJobsIndexQuery): QueueName[] {
    return query.filter?.queueNames ?? Object.values(QueueName)
  }

  private getJobTable (query: ViewJobsIndexQuery): string {
    const archived = toBoolean(query.filter?.archived ?? false)
    return archived ? 'pgboss.archive' : 'pgboss.job'
  }
}
