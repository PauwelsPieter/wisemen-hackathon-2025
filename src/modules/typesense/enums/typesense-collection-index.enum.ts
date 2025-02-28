import { PaginatedOffsetResponse } from '@wisemen/pagination'
import type { UserSearchSchema } from '../collections/user.collections.js'

export enum TypesenseCollectionName {
  USER = 'user'
}

export interface MultiSearchResult {
  [TypesenseCollectionName.USER]?: PaginatedOffsetResponse<UserSearchSchema>
}
