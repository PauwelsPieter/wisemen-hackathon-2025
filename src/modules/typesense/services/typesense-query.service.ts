import { captureException } from '@sentry/nestjs'
import { Injectable } from '@nestjs/common'
import type {
  DocumentSchema,
  SearchParams,
  SearchResponse
} from 'typesense/lib/Typesense/Documents.js'
import type { MultiSearchRequestsSchema } from 'typesense/lib/Typesense/MultiSearch.js'
import { MultiSearchRequestSchema } from 'typesense/src/Typesense/MultiSearch.js'
import { PaginatedOffsetResponseMeta, PaginatedOffsetResponse } from '@wisemen/pagination'
import type {
  MultiSearchResult,
  TypesenseCollectionName
} from '../enums/typesense-collection-index.enum.js'
import { TypesenseClient } from '../clients/typesense.client.js'
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../builder/search-params.builder.js'
import { UserTypesenseCollection } from '../../../app/users/typesense/user.collections.js'
import { TypesenseUser } from '../../../app/users/typesense/typesense-user.js'

@Injectable()
export class TypesenseQueryService {
  constructor (
    private readonly typesenseClient: TypesenseClient
  ) {
  }

  static COLLECTIONS = [
    new UserTypesenseCollection()
  ]

  public async searchAll (query: string): Promise<MultiSearchResult> {
    const searchRequests = this.buildMultiSearchRequest(query)

    const { results } = await this.typesenseClient
      .client
      .multiSearch
      .perform<[TypesenseUser]>(searchRequests)

    return results.reduce((acc, collection, index) => ({
      ...acc,
      ...this.transformSearchResult(collection, TypesenseQueryService.COLLECTIONS[index].name)
    }), {})
  }

  public async search (
    index: TypesenseCollectionName,
    searchParams: SearchParams
  ): Promise<MultiSearchResult> {
    try {
      const result = await this.typesenseClient.client
        .collections(index)
        .documents()
        .search(searchParams)

      return this.transformSearchResult(result, index)
    } catch (e) {
      captureException(e)

      return {}
    }
  }

  public async searchIn<T extends TypesenseCollectionName>(
    index: T,
    searchParams: SearchParams
  ): Promise<Exclude<MultiSearchResult[T], undefined>> {
    const multiSearchResult = await this.search(index, searchParams)

    return multiSearchResult[index] as Exclude<MultiSearchResult[T], undefined>
  }

  private buildMultiSearchRequest (query: string): MultiSearchRequestsSchema {
    const searchRequestSchemas: MultiSearchRequestSchema[] = []

    for (const collection of TypesenseQueryService.COLLECTIONS) {
      searchRequestSchemas.push({
        collection: collection.name,
        q: query,
        query_by: collection.searchableFields.map(f => f.name).join(',') ?? ''
      })
    }

    return { searches: searchRequestSchemas }
  }

  private transformSearchResult<T extends DocumentSchema>(
    result: SearchResponse<T>,
    index: string
  ): MultiSearchResult {
    const items = result.hits?.map(hit => hit.document) ?? []

    const limit = result.request_params.per_page ?? DEFAULT_LIMIT
    const page = result.request_params.page ?? DEFAULT_OFFSET
    const offset = page * limit

    const meta = new PaginatedOffsetResponseMeta(
      result.found,
      offset,
      limit
    )

    return { [index]: new PaginatedOffsetResponse(items, meta) }
  }
}
