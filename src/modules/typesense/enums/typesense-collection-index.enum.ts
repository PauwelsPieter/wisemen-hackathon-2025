import { PaginatedOffsetResponse } from '@wisemen/pagination'
import { TypesenseUser } from '../../../app/users/typesense/typesense-user.js'

export enum TypesenseCollectionName {
  USER = 'user'
}

export interface MultiSearchResult {
  [TypesenseCollectionName.USER]?: PaginatedOffsetResponse<TypesenseUser>
}
