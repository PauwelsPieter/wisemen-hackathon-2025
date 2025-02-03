import assert from 'assert'
import type { SearchParams } from 'typesense/lib/Typesense/Documents.js'
import type {
  FilterField,
  SearchField,
  SortField,
  TypesenseCollection
} from '../collections/abstract-typesense.collection.js'
import { FilterOptions } from '../enums/typesense-filter-options.enum.js'
import type { SortDirection } from '../../pagination/search.query.js'
import { TypesenseOperationMode } from '../enums/typesense-operation-mode.enum.js'

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
    options?: FilterOptions): this {
    if (values !== undefined) {
      this.filters.push(`${filterField}:${this.getOperator(options)}[${values.join(',')}]`)
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
      filter_by: this.filters.join(' && '),
      sort_by: this.sorting.join(','),
      offset: this.offset,
      limit: this.limit,
      infix: this.infix
    }
  }

  private getOperator (options?: FilterOptions): string {
    return options ?? FilterOptions.EQUALS
  }
}
