import { ViewJobDetailQuery } from './view-job-detail.query.js'

export class ViewJobDetailQueryBuilder {
  private query: ViewJobDetailQuery

  constructor () {
    this.query = new ViewJobDetailQuery()
  }

  withIsArchived (isArchived: boolean): this {
    this.query.isArchived = String(isArchived) as 'true' | 'false'
    return this
  }

  build (): ViewJobDetailQuery {
    return this.query
  }
}
