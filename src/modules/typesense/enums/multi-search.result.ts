import { MultiSearchRequestSchema } from 'typesense/lib/Typesense/MultiSearch.js'
import { PaginatedOffsetResponse } from '@wisemen/pagination'
import { TypesenseUser } from '../../../app/users/typesense/typesense-user.js'
import { TypesenseContact } from '../../../app/contact/typesense/typesense-contact.js'
import { TypesenseCollectionName } from './typesense-collection-index.enum.js'

export interface TypesenseCollectionSchema {
  [TypesenseCollectionName.USER]: TypesenseUser
  [TypesenseCollectionName.CONTACT]: TypesenseContact
}

export type MultiSearchResult<T extends TypesenseCollectionName> =
  PaginatedOffsetResponse<TypesenseCollectionSchema[T]>

export interface CustomMultiSearchRequestSchema<T extends TypesenseCollectionName>
  extends MultiSearchRequestSchema {
  collection: T
}

export type CustomMultiSearchRequestSchemas<T extends TypesenseCollectionName> =
CustomMultiSearchRequestSchema<T>[]

export type TypesenseCollectionSchemas<T extends TypesenseCollectionName[]> =
TypesenseCollectionSchema[T[number]][]

export type MultiSearchResponse<T extends TypesenseCollectionName> = {
  [K in T]: MultiSearchResponseItem<K>[]
}

export type MultiSearchResponseItem<T extends TypesenseCollectionName> = {
  item: TypesenseCollectionSchema[T]
  text_match: number
}

export type MappedMultiSearchResponseItem<T extends TypesenseCollectionName> = {
  collection: T
  item: TypesenseCollectionSchema[T]
  text_match: number
}
