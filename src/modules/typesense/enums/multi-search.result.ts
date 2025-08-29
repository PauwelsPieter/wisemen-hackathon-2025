import { PaginatedOffsetResponse } from '@wisemen/pagination'
import { MultiSearchRequestSchema } from 'typesense/lib/Typesense/Types.js'
import { TypesenseUser } from '../../../app/users/typesense/typesense-user.js'
import { TypesenseContact } from '../../../app/contact/typesense/typesense-contact.js'
import { TypesenseCollectionName } from '../collections/typesense-collection-name.enum.js'
import { TypesenseAirport } from '../../../app/airport/typesense/typesense-airport.js'
import { TypesenseGse } from '../../../app/gse/typesense/typesense-gse.js'
import { TypesensePlanning } from '../../../app/planning/typesense/typesense-planning.js'

export interface TypesenseCollectionSchema {
  [TypesenseCollectionName.AIRPORT]: TypesenseAirport
  [TypesenseCollectionName.GSE]: TypesenseGse
  [TypesenseCollectionName.PLANNING]: TypesensePlanning
  [TypesenseCollectionName.USER]: TypesenseUser
  [TypesenseCollectionName.CONTACT]: TypesenseContact
}

export type MultiSearchResult<T extends TypesenseCollectionName> =
  PaginatedOffsetResponse<TypesenseCollectionSchema[T]>

export interface CustomMultiSearchRequestSchema<T extends TypesenseCollectionName>
  extends MultiSearchRequestSchema<object, string> {
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
