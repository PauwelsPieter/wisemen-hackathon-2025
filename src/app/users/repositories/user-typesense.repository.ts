import { Injectable } from '@nestjs/common'
import type { SearchParams } from 'typesense/lib/Typesense/Documents.js'
import { TypesenseQueryService } from '../../../modules/typesense/services/typesense-query.service.js'
import { TypesenseSearchParamsBuilder } from '../../../modules/typesense/builder/search-params.builder.js'
import { UserSearchSchema, UserTypesenseCollection } from '../../../modules/typesense/collections/user.collections.js'
import { TypesenseCollectionName } from '../../../modules/typesense/enums/typesense-collection-index.enum.js'

import type { ViewUsersQuery } from '../use-cases/view-users/view-users.query.js'

@Injectable()
export class UserTypesenseRepository {
  constructor (
    private readonly typesenseService: TypesenseQueryService
  ) {}

  async findPaginated (
    query: ViewUsersQuery
  ): Promise<[items: UserSearchSchema[], count: number] > {
    const typesenseSearchParams = this.createTypesenseSearchParams(query)

    const users = await this.typesenseService.searchIn(
      TypesenseCollectionName.USER,
      typesenseSearchParams
    )

    return [
      users.items ?? [],
      users.meta.total ?? 0
    ]
  }

  private createTypesenseSearchParams (query: ViewUsersQuery): SearchParams {
    const searchParamBuilder
      = new TypesenseSearchParamsBuilder(new UserTypesenseCollection())
        .withQuery(query.search)
        .withOffset(query.pagination?.offset)
        .withLimit(query.pagination?.limit)
        .addSearchOn(['firstName', 'lastName'])
        .addFilterOn('permissions', query.filter?.permissions)

    return searchParamBuilder.build()
  }
}
