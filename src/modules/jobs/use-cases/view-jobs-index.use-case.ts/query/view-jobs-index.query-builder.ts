import { QueueName } from '../../../../pgboss/enums/queue-name.enum.js'
import { ViewJobsIndexFilterQuery } from './view-jobs-index.filter-query.js'
import { ViewJobsIndexPaginationQuery } from './view-jobs-index.pagination-query.js'
import { ViewJobsIndexQueryKey } from './view-jobs-index.query-key.js'
import { ViewJobsIndexQuery } from './view-jobs-index.query.js'

export class ViewJobIndexQueryBuilder {
  private query: ViewJobsIndexQuery

  constructor () {
    this.query = new ViewJobsIndexQuery()
  }

  withQueueNames (queueNames: QueueName[]): this {
    this.query.filter ??= new ViewJobsIndexFilterQuery()
    this.query.filter.queueNames = queueNames
    return this
  }

  withArchived (archived: boolean): this {
    this.query.filter ??= new ViewJobsIndexFilterQuery()
    this.query.filter.archived = String(archived)
    return this
  }

  withLimit (limit: number): this {
    this.query.pagination ??= new ViewJobsIndexPaginationQuery()
    this.query.pagination.limit = limit
    return this
  }

  withKey (key: ViewJobsIndexQueryKey): this {
    this.query.pagination ??= new ViewJobsIndexPaginationQuery()
    this.query.pagination.key = key
    return this
  }

  build (): ViewJobsIndexQuery {
    return this.query
  }
}
