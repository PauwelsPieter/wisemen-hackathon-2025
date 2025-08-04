import type { FieldType, CollectionFieldSchema } from 'typesense/lib/Typesense/Collection.js'
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js'

export type SearchField<T extends TypesenseCollection> = T['searchableFields'][number]['name']
export type FilterField<T extends TypesenseCollection> = T['filterableFields'][number]['name'] | SearchField<T>
export type SortField<T extends TypesenseCollection> = Extract<T['searchableFields'][number] | T['filterableFields'][number], { sort: true }>['name']
export type ReferenceField<T extends TypesenseCollection> = T['referenceFields'][number]['collectionName']

export interface TypesenseField {
  readonly name: string
  readonly optional?: boolean
  readonly type: FieldType
  readonly sort?: boolean
  readonly infix?: boolean
}

export interface TypesenseReferenceField extends TypesenseField {
  readonly collectionName: string
}

export abstract class TypesenseCollection {
  abstract readonly name: string
  abstract readonly searchableFields: Readonly<TypesenseField[]>
  abstract readonly filterableFields: Readonly<TypesenseField[]>
  abstract readonly referenceFields: Readonly<TypesenseReferenceField[]>

  public getSchema (): CollectionCreateSchema {
    const searchFields: CollectionFieldSchema[] = this.searchableFields.map(
      field => ({
        name: field.name,
        type: field.type,
        optional: field.optional,
        sort: field.sort,
        infix: field.infix
      })
    )

    const filterFields: CollectionFieldSchema[] = this.filterableFields.map(
      field => ({
        name: field.name,
        type: field.type,
        optional: field.optional,
        sort: field.sort,
        facet: true
      })
    )

    const referenceFields: CollectionFieldSchema[] = this.referenceFields.map(
      field => ({
        name: field.name,
        type: field.type,
        optional: field.optional,
        sort: field.sort,
        facet: true,
        reference: `${field.collectionName}.id`,
        async_reference: true
      })
    )

    return {
      name: this.name,
      fields: [...searchFields, ...filterFields, ...referenceFields]
    }
  }
}
