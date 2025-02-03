import { captureException } from '@sentry/nestjs'
import { Injectable } from '@nestjs/common'
import type { SearchParams } from 'typesense/lib/Typesense/Documents.js'
import type { MultiSearchRequestsSchema } from 'typesense/lib/Typesense/MultiSearch.js'
import type { MultiSearchResult, TypesenseCollectionName } from '../enums/typesense-collection-index.enum.js'
import { TypesenseClient } from '../clients/typesense.client.js'
import { UserTypesenseCollection, type UserSearchSchema } from '../collections/user.collections.js'

@Injectable()
export class TypesenseQueryService {
  constructor (
    private readonly typesenseClient: TypesenseClient
  ) {}

  static COLLECTIONS = [
    new UserTypesenseCollection().getSchema()
  ]

  public async searchAll (query: string): Promise<MultiSearchResult> {
    const searchRequests: MultiSearchRequestsSchema = {
      searches: TypesenseQueryService.COLLECTIONS.map((collection) => {
        return {
          collection: collection.name,
          q: query,
          query_by: collection.fields?.map(f => f.name).join(',') ?? ''
        }
      })
    }

    const { results } = await this.typesenseClient
      .client
      .multiSearch
      .perform<[UserSearchSchema]>(searchRequests)

    const result: MultiSearchResult = results.reduce((acc, collection, index) => ({
      ...acc,
      ...this.transformSearchResult(collection, TypesenseQueryService.COLLECTIONS[index].name)
    }), {})

    return result
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

  private transformSearchResult (
    result: {
      hits?: Array<{ document: unknown }>
      found: number
      page: number
      request_params: { per_page?: number }
    },
    index: string
  ): MultiSearchResult {
    return {
      [index]: {
        items: result.hits?.map(hit => hit.document) ?? [],
        meta: {
          total: result.found,
          offset: result.page - 1,
          limit: result.request_params.per_page ?? 0
        }
      }
    }
  }
}
