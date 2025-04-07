import assert from 'assert'
import type { SearchParams } from 'typesense/lib/Typesense/Documents.js'
import { SortDirection } from '@wisemen/pagination'
import type {
  FilterField,
  SearchField,
  SortField,
  TypesenseCollection
} from '../collections/abstract-typesense.collection.js'
import { TypesenseFilterOptions } from '../enums/typesense-filter-options.enum.js'
import { TypesenseOperationMode } from '../enums/typesense-operation-mode.enum.js'
import { TypesenseLogicOperator } from '../enums/typesense-logic-operator.enum.js'
import { TypesenseFilterParamsBuilder } from './filter-params.builder.js'

export const DEFAULT_LIMIT = 10
export const DEFAULT_OFFSET = 0

export class TypesenseSearchParamsBuilder<Collection extends TypesenseCollection> {
  private readonly filters: string[] = []
  private queries: string[] = []
  private readonly sorting: string[] = []
  private query: string = ''
  private offset: number = DEFAULT_OFFSET
  private limit: number = DEFAULT_LIMIT
  private infix: TypesenseOperationMode[] = []

  constructor (private readonly collection: Collection) {}

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
    values: string[] | undefined,
    options?: TypesenseFilterOptions): this {
    if (values !== undefined) {
      const joinedValue = values.join(',')
      const value = values.length > 1 ? `[${joinedValue}]` : joinedValue

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

  build (): SearchParams {
    let queryBy: string = ''

    if (this.queries.length > 0) {
      queryBy = this.queries.join(',')
    } else {
      queryBy = this.collection.searchableFields
        .map(field => field.name)
        .join(',')
    }

    return {
      q: this.query,
      query_by: queryBy,
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
}
