import { Injectable } from '@nestjs/common'
import type { SearchParams } from 'typesense/lib/Typesense/Documents.js'
import { PaginatedOffsetResponse, PaginatedOffsetResponseMeta } from '@wisemen/pagination'
import { captureException } from '@sentry/nestjs'
import { TypesenseCollectionName } from '../collections/typesense-collection-name.enum.js'
import { TypesenseClient } from '../client/typesense.client.js'
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../param-builders/search-params.builder.js'
import { TypesenseCollectionSchema, CustomMultiSearchRequestSchemas, MultiSearchResult, MultiSearchResponse } from '../enums/multi-search.result.js'

@Injectable()
export class TypesenseQueryService {
  constructor (
    private readonly typesenseClient: TypesenseClient
  ) {}

  public async multiSearch <T extends TypesenseCollectionName>(
    searchSchemas: CustomMultiSearchRequestSchemas<T>
  ): Promise<MultiSearchResponse<T>> {
    try {
      const results = await this.typesenseClient.client
        .multiSearch.perform<TypesenseCollectionSchema[T][]>({ searches: searchSchemas })

      console.log(results)

      const response: MultiSearchResponse<T> = {} as MultiSearchResponse<T>

      results.results.map((item, index) => {
        const collectionName = searchSchemas[index].collection

        response[collectionName] = item.hits?.map((hit) => {
          return {
            item: hit.document,
            text_match: hit.text_match
          }
        }) ?? []
      })

      return response
    } catch (e) {
      captureException(e)

      throw new Error('[Typesense] Query failed: ' + (e as Error).message)
    }
  }

  public async search<T extends TypesenseCollectionName>(
    index: T,
    searchParams: SearchParams<object>
  ): Promise<MultiSearchResult<T>> {
    try {
      const result = await this.typesenseClient.client
        .collections(index)
        .documents()
        .search(searchParams)

      const limit = result.request_params.per_page ?? DEFAULT_LIMIT
      const offset = searchParams.offset ?? DEFAULT_OFFSET
      const meta = new PaginatedOffsetResponseMeta(result.found, offset, limit)
      const documents = result.hits?.map(hit => hit.document) ?? []
      const items = documents as unknown as TypesenseCollectionSchema[T][]

      return new PaginatedOffsetResponse<TypesenseCollectionSchema[T]>(items, meta)
    } catch (e) {
      captureException(e)

      throw new Error('[Typesense] Query failed: ' + (e as Error).message)
    }
  }
}
