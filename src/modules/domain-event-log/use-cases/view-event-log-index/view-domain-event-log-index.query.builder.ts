import { DomainEventSubjectType } from '../../../domain-events/domain-event-subject-type.enum.js'
import { ViewDomainEventLogIndexFilterQuery, ViewDomainEventLogIndexPaginationQuery, ViewDomainEventLogIndexQuery } from './view-domain-event-log-index.query.js'
import { ViewDomainEventLogIndexQueryKey } from './view-domain-event-log-index.query.key.js'

export class ViewDomainEventLogIndexQueryBuilder {
  private readonly query: ViewDomainEventLogIndexQuery

  constructor () {
    this.query = new ViewDomainEventLogIndexQuery()
  }

  withSubjectType (type: DomainEventSubjectType): this {
    this.query.filter ??= new ViewDomainEventLogIndexFilterQuery()
    this.query.filter.subjectType = type
    return this
  }

  withSubjectId (id: string): this {
    this.query.filter ??= new ViewDomainEventLogIndexFilterQuery()
    this.query.filter.subjectId = id
    return this
  }

  withUserUuid (uuid: string): this {
    this.query.filter ??= new ViewDomainEventLogIndexFilterQuery()
    this.query.filter.userUuid = uuid
    return this
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
