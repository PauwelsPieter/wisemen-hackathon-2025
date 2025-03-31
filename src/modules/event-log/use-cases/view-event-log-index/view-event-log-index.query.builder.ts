import { ViewEventLogIndexPaginationQuery, ViewEventLogIndexQuery } from './view-event-log-index.query.js'
import { ViewEventLogIndexQueryKey } from './view-event-log-index.query.key.js'

export class ViewEventLogIndexQueryBuilder {
  private readonly query: ViewEventLogIndexQuery

  constructor () {
    this.query = new ViewEventLogIndexQuery()
  }

  withLimit (limit: number): this {
    this.query.pagination ??= new ViewEventLogIndexPaginationQuery()
    this.query.pagination.limit = limit

    return this
  }

  withKey (key: ViewEventLogIndexQueryKey): this {
    this.query.pagination ??= new ViewEventLogIndexPaginationQuery()
    this.query.pagination.key = key

    return this
  }

  build (): ViewEventLogIndexQuery {
    return this.query
  }
}
