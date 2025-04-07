import { ViewDomainEventLogIndexPaginationQuery, ViewDomainEventLogIndexQuery } from './view-domain-event-log-index.query.js'
import { ViewDomainEventLogIndexQueryKey } from './view-domain-event-log-index.query.key.js'

export class ViewDomainEventLogIndexQueryBuilder {
  private readonly query: ViewDomainEventLogIndexQuery

  constructor () {
    this.query = new ViewDomainEventLogIndexQuery()
  }

  withLimit (limit: number): this {
    this.query.pagination ??= new ViewDomainEventLogIndexPaginationQuery()
    this.query.pagination.limit = limit

    return this
  }

  withKey (key: ViewDomainEventLogIndexQueryKey): this {
    this.query.pagination ??= new ViewDomainEventLogIndexPaginationQuery()
    this.query.pagination.key = key

    return this
  }

  build (): ViewDomainEventLogIndexQuery {
    return this.query
  }
}
