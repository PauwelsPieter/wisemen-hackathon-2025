import { Injectable } from '@nestjs/common'
import { TypesenseQueryService } from '../../typesense/services/typesense-query.service.js'
import { TypesenseCollectionName } from '../../typesense/collections/typesense-collection-name.enum.js'
import { CustomMultiSearchRequestSchema, MappedMultiSearchResponseItem, MultiSearchResponse } from '../../typesense/enums/multi-search.result.js'
import { GlobalSearchTypesenseCollectionNames, GlobalSearchTypesenseCollections } from '../global-search-typesense-collections.js'
import { UserTypesenseCollection } from '../../../app/users/typesense/user.collections.js'
import { TypesenseOperationMode } from '../../typesense/param-builders/enums/typesense-operation-mode.enum.js'
import { TypesenseSearchParamsBuilder as ParamBuilder } from '../../typesense/param-builders/search-params.builder.js'
import { ContactTypesenseCollection } from '../../../app/contact/typesense/contact.typesense-collection.js'
import { SearchCollectionsResponse } from './responses/search-collections.response.js'
import { SearchCollectionsQuery } from './query/search-collections.query.js'

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
      searchParams.push(this.buildSearchParams(query, collection))
    }

    const searchResult = await this.typesense.multiSearch(searchParams)

    const sortedResults = this.mapAndSortResults(searchResult)

    return new SearchCollectionsResponse(sortedResults)
  }

  private buildSearchParams <T extends TypesenseCollectionName>(
    query: SearchCollectionsQuery,
    collection: T
  ): CustomMultiSearchRequestSchema<T> {
    const params = new ParamBuilder()
      .withQuery(query.search)

    switch (collection) {
      case TypesenseCollectionName.USER:
        this.addUserParams(params as unknown as ParamBuilder<UserTypesenseCollection>)
        break
      case TypesenseCollectionName.CONTACT:
        this.addContactParams(params as unknown as ParamBuilder<ContactTypesenseCollection>, query)
        break
      default:
        throw new Error(`Collection ${collection} not supported`)
    }

    return { collection, ...params.build() }
  }

  private addUserParams (
    searchParams: ParamBuilder<UserTypesenseCollection>
  ): void {
    searchParams
      .addSearchOn('firstName', TypesenseOperationMode.ALWAYS)
      .addSearchOn('lastName', TypesenseOperationMode.ALWAYS)
      .addSearchOn('email', TypesenseOperationMode.ALWAYS)
  }

  private addContactParams (
    searchParams: ParamBuilder<ContactTypesenseCollection>,
    query: SearchCollectionsQuery
  ): void {
    searchParams
      .addSearchOn('name', TypesenseOperationMode.ALWAYS)
      .addSearchOn('email', TypesenseOperationMode.ALWAYS)
      .addFilterOn('isActive', query.filter?.contact?.isActive)
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
