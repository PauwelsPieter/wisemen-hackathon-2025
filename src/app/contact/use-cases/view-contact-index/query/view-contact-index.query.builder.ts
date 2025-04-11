import { ViewContactIndexFilterQuery, ViewContactIndexQuery } from './view-contact-index.query.js'

export class ViewContactIndexQueryBuilder {
  private readonly query: ViewContactIndexQuery

  constructor () {
    this.query = new ViewContactIndexQuery()
  }

  withSearch (search: string): this {
    this.query.search = search
    return this
  }

  withFilter (filter: ViewContactIndexFilterQuery): this {
    this.query.filter = filter
    return this
  }

  withLimit (limit: number): this {
    this.query.pagination = {
      limit,
      offset: this.query.pagination?.offset ?? 0
    }
    return this
  }

  withOffset (offset: number): this {
    this.query.pagination = {
      limit: this.query.pagination?.limit ?? 20,
      offset
    }
    return this
  }

  build (): ViewContactIndexQuery {
    return this.query
  }
}
