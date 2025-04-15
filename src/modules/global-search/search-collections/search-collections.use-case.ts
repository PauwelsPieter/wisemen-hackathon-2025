import { Injectable } from '@nestjs/common'
import { TypesenseQueryService } from '../../typesense/services/typesense-query.service.js'
import { TypesenseCollectionName } from '../../typesense/enums/typesense-collection-index.enum.js'
import { CustomMultiSearchRequestSchema, MappedMultiSearchResponseItem, MultiSearchResponse } from '../../typesense/enums/multi-search.result.js'
import { GlobalSearchTypesenseCollectionNames, GlobalSearchTypesenseCollections } from '../global-search-typesense-collections.js'
import { SearchCollectionsQuery } from './query/search-collections.query.js'
import { SearchCollectionsResponse } from './responses/search-collections.response.js'

@Injectable()
export class SearchCollectionsUseCase {
  constructor (
    private readonly typesense: TypesenseQueryService
  ) {}

  async execute (
    query: SearchCollectionsQuery
  ): Promise<SearchCollectionsResponse> {
    const searchParams: CustomMultiSearchRequestSchema<GlobalSearchTypesenseCollectionNames>[] = []

    for (const collection of query.filter?.collections ?? GlobalSearchTypesenseCollections) {
      searchParams.push(this.buildSearchParams(query.search, collection))
    }

    const searchResult = await this.typesense.multiSearch(searchParams)

    const sortedResults = this.mapAndSortResults(searchResult)

    return new SearchCollectionsResponse(sortedResults)
  }

  private buildSearchParams <T extends TypesenseCollectionName>(
    search: string,
    collection: T
  ): CustomMultiSearchRequestSchema<T> {
    switch (collection) {
      case TypesenseCollectionName.USER:{
        return {
          collection: collection,
          q: search,
          query_by: 'firstName,lastName,email',
          infix: 'always'
        }
      }
      case TypesenseCollectionName.CONTACT: {
        return {
          collection: collection,
          q: search,
          query_by: 'name,email',
          infix: 'always'
        }
      }
      default:
        throw new Error(`Collection ${collection} not supported`)
    }
  }

  private mapAndSortResults <T extends TypesenseCollectionName> (
    searchResult: MultiSearchResponse<T>
  ): MappedMultiSearchResponseItem<T>[] {
    const results: MappedMultiSearchResponseItem<T>[] = []

    let collection: T

    for (collection in searchResult) {
      const collectionResults = searchResult[collection]

      for (const result of collectionResults) {
        results.push({
          collection: collection,
          item: result.item,
          text_match: result.text_match
        })
      }
    }

    return results.sort((a, b) => b.text_match - a.text_match)
  }
}
