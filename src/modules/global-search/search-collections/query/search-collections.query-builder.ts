import { GlobalSearchTypesenseCollectionNames } from '../../global-search-typesense-collections.js'
import { SearchCollectionsQuery } from './search-collections.query.js'

export class SearchCollectionsQueryBuilder {
  private query: SearchCollectionsQuery
  constructor () {
    this.query = new SearchCollectionsQuery()
    this.query.search = 'test'
  }

  withSearch (search: string): this {
    this.query.search = search

    return this
  }

  withFilterOn (collections: GlobalSearchTypesenseCollectionNames[]): this {
    this.query.filter ??= {}
    this.query.filter.collections = collections

    return this
  }

  withContactActive (active: boolean): this {
    this.query.filter ??= {}
    this.query.filter.contact ??= {}
    this.query.filter.contact.isActive = String(active)
    return this
  }

  build (): SearchCollectionsQuery {
    return this.query
  }
}
