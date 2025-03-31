import { ApiPropertyOptions, ApiProperty } from '@nestjs/swagger'
import { TypesenseCollectionName } from '../typesense/enums/typesense-collection-index.enum.js'
import { MappedMultiSearchResponseItem } from '../typesense/enums/multi-search.result.js'

export type GlobalSearchTypesenseCollectionNames = typeof GlobalSearchTypesenseCollections[number]

export const GlobalSearchTypesenseCollections = [
  TypesenseCollectionName.USER
] as const

export function GlobalSearchTypesenseCollectionNameApiProperty (
  options?: ApiPropertyOptions
): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: GlobalSearchTypesenseCollections,
    enumName: 'GlobalSearchCollectionName'
  })
}

export type GlobalSearchTypesenseResult =
   MappedMultiSearchResponseItem<GlobalSearchTypesenseCollectionNames>
