import { captureException } from '@sentry/nestjs'
import { Injectable } from '@nestjs/common'
import type {
  DocumentSchema,
  SearchParams,
  SearchResponse
} from 'typesense/lib/Typesense/Documents.js'
import type { MultiSearchRequestsSchema } from 'typesense/lib/Typesense/MultiSearch.js'
import { MultiSearchRequestSchema } from 'typesense/src/Typesense/MultiSearch.js'
import type {
  MultiSearchResult,
  TypesenseCollectionName
} from '../enums/typesense-collection-index.enum.js'
import { TypesenseClient } from '../clients/typesense.client.js'
import { type UserSearchSchema, UserTypesenseCollection } from '../collections/user.collections.js'
import {
  PaginatedOffsetResponse,
  PaginatedOffsetResponseMeta
} from '../../pagination/offset/paginated-offset.response.js'
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../builder/search-params.builder.js'

@Injectable()
export class TypesenseQueryService {
  constructor (
    private readonly typesenseClient: TypesenseClient
  ) {}

  static COLLECTIONS = [
    new UserTypesenseCollection()
  ]

  public async searchAll (query: string): Promise<MultiSearchResult> {
    const searchRequests = this.buildMultiSearchRequest(query)

    const { results } = await this.typesenseClient
      .client
      .multiSearch
      .perform<[UserSearchSchema]>(searchRequests)

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
    const meta = new PaginatedOffsetResponseMeta(
      result.found,
      result.request_params.limit ?? DEFAULT_LIMIT,
      result.request_params.offset ?? DEFAULT_OFFSET
    )

    return { [index]: new PaginatedOffsetResponse(items, meta) }
  }
}
