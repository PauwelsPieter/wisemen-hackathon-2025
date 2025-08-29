import { Injectable } from '@nestjs/common'
import { TypesenseQueryService } from '../../typesense/services/typesense-query.service.js'
import { TypesenseCollectionName } from '../../typesense/collections/typesense-collection-name.enum.js'
import { CustomMultiSearchRequestSchema, MappedMultiSearchResponseItem, MultiSearchResponse } from '../../typesense/enums/multi-search.result.js'
import { GlobalSearchTypesenseCollectionNames, GlobalSearchTypesenseCollections } from '../global-search-typesense-collections.js'
import { TypesenseSearchParamsBuilder as ParamBuilder } from '../../typesense/param-builders/search-params.builder.js'
import { AirportTypesenseCollection } from '../../../app/airport/typesense/airport.collections.js'
import { GseTypesenseCollection } from '../../../app/gse/typesense/gse.collections.js'
import { PlanningTypesenseCollection } from '../../../app/planning/typesense/planning.collections.js'
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
      .withLimit(5)

    if (query.prompt !== undefined && query.model !== undefined) {
      params.withNlQuery(query.prompt, query.model)
    }

    switch (collection) {
      case TypesenseCollectionName.AIRPORT:
        this.addAirportParams(params as unknown as ParamBuilder<AirportTypesenseCollection>)
        break
      case TypesenseCollectionName.GSE:
        this.addGseParams(params as unknown as ParamBuilder<GseTypesenseCollection>)
        break
      case TypesenseCollectionName.PLANNING:
        this.addPlanningParams(params as unknown as ParamBuilder<PlanningTypesenseCollection>)
        break
      default:
        throw new Error(`Collection ${collection} not supported`)
    }

    return { collection, ...params.build() }
  }

  private addAirportParams (
    searchParams: ParamBuilder<AirportTypesenseCollection>
  ): void {
    searchParams
      .addSearchOn('code')
      .addSearchOn('name')
  }

  private addGseParams (
    searchParams: ParamBuilder<GseTypesenseCollection>
  ): void {
    searchParams
      .addSearchOn('airportName')
      .addSearchOn('type')
      // .innerJoin(TypesenseCollectionName.AIRPORT)
  }

  private addPlanningParams (
    searchParams: ParamBuilder<PlanningTypesenseCollection>
  ): void {
    searchParams
      .addSearchOn('from')
      .addSearchOn('to')
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
