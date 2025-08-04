import assert from 'assert'
import type { SearchParams } from 'typesense/lib/Typesense/Documents.js'
import { SortDirection } from '@wisemen/pagination'
import type {
  FilterField,
  ReferenceField,
  SearchField,
  SortField,
  TypesenseCollection
} from '../collections/typesense.collection.js'
import { TypesenseCollectionName } from '../collections/typesense-collection-name.enum.js'
import { TypesenseFilterOptions } from './enums/typesense-filter-options.enum.js'
import { TypesenseOperationMode } from './enums/typesense-operation-mode.enum.js'
import { TypesenseLogicOperator } from './enums/typesense-logic-operator.enum.js'
import { TypesenseFilterParamsBuilder } from './filter-params.builder.js'
import { TypesenseJoinType } from './enums/typesense-join-type.enum.js'
import { TypesenseJoinOptions, TypesenseJoinParamsBuilder } from './join-params.builder.js'

export const DEFAULT_LIMIT = 10
export const DEFAULT_OFFSET = 0

export class TypesenseSearchParamsBuilder<Collection extends TypesenseCollection> {
  private filters: string[] = []
  private queries: string[] = []
  private sorting: string[] = []
  private includeFields: string[] = []
  private query: string = '*'
  private offset: number = DEFAULT_OFFSET
  private limit: number = DEFAULT_LIMIT
  private infix: TypesenseOperationMode[] = []

  constructor () {}

  withQuery (query: string | undefined): this {
    if (query != null) {
      this.query = query
    }

    return this
  }

  withOffset (offset: number | undefined): this {
    if (offset != null) {
      this.offset = offset
    }

    return this
  }

  withLimit (limit: number | undefined): this {
    if (limit != null) {
      this.limit = limit
    }

    return this
  }

  addSearchOn (searchField: SearchField<Collection>, infix?: TypesenseOperationMode): this
  addSearchOn (
    searchField: Array<SearchField<Collection>>,
    infix?: Array<TypesenseOperationMode>
  ): this
  addSearchOn (
    searchField: SearchField<Collection> | Array<SearchField<Collection>>,
    infix?: TypesenseOperationMode | Array<TypesenseOperationMode>
  ): this {
    if (searchField == null) {
      return this
    }

    if (Array.isArray(searchField)) {
      assert(infix === undefined || Array.isArray(infix))

      for (let i = 0; i < searchField.length; i++) {
        this.addSearchOnField(searchField[i], infix?.[i])
      }
    } else {
      assert(infix === undefined || !Array.isArray(infix))
      this.addSearchOnField(searchField, infix)
    }

    return this
  }

  private addSearchOnField (
    searchField: SearchField<Collection>,
    infix: TypesenseOperationMode = TypesenseOperationMode.OFF
  ): void {
    this.queries.push(searchField)
    this.infix.push(infix)
  }

  addFilterOn (
    filterField: FilterField<Collection>,
    values: string | string[] | undefined,
    options?: TypesenseFilterOptions
  ): this {
    if (values !== undefined) {
      const joinedValue = Array.isArray(values) ? values.join(',') : values
      const value = (Array.isArray(values) && values.length > 1) ? `[${joinedValue}]` : joinedValue

      this.filters.push(`${filterField}:${this.getOperator(options)}${value}`)
    }

    return this
  }

  addGroupFilter (
    callback: (builder: TypesenseFilterParamsBuilder<Collection>) => void
  ): this {
    const builder = new TypesenseFilterParamsBuilder<Collection>()

    callback(builder)

    const filter = `(${builder.build()})`

    if (filter) {
      this.filters.push(filter)
    }

    return this
  }

  addSortOn (SortField: SortField<Collection>, direction: SortDirection): this {
    this.sorting.push(`${SortField}:${direction}`)

    return this
  }

  innerJoin (
    field: ReferenceField<Collection>,
    options?: TypesenseJoinOptions
  ): this {
    return this.addJoin(TypesenseJoinType.INNER, field, undefined, options)
  }

  leftJoin (
    field: ReferenceField<Collection>,
    options?: TypesenseJoinOptions
  ): this {
    return this.addJoin(TypesenseJoinType.LEFT, field, undefined, options)
  }

  inverseJoin (
    collectionName: TypesenseCollectionName,
    filterBy: string,
    options?: TypesenseJoinOptions
  ): this {
    return this.addJoin(TypesenseJoinType.INVERSE, collectionName, filterBy, options)
  }

  build (): SearchParams {
    return {
      q: this.query,
      query_by: this.queries.join(','),
      include_fields: this.includeFields.join(','),
      filter_by: this.filters.join(` ${TypesenseLogicOperator.AND} `),
      sort_by: this.sorting.join(','),
      offset: this.offset,
      limit: this.limit,
      infix: this.infix
    }
  }

  private getOperator (options?: TypesenseFilterOptions): string {
    return options ?? TypesenseFilterOptions.EQUALS
  }

  private addJoin (
    type: TypesenseJoinType,
    field: ReferenceField<Collection> | TypesenseCollectionName,
    filterBy?: string,
    options?: TypesenseJoinOptions
  ): this {
    const builder = new TypesenseJoinParamsBuilder<Collection>()
    const joinParams = builder.build(type, field, filterBy, options)

    this.includeFields.push(joinParams.fields)

    if (joinParams.filter != undefined) {
      this.filters.push(joinParams.filter)
    }

    return this
  }
}
