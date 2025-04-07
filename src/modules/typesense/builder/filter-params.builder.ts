import { FilterField, TypesenseCollection } from '../collections/abstract-typesense.collection.js'
import { TypesenseFilterOptions } from '../enums/typesense-filter-options.enum.js'
import { TypesenseLogicOperator } from '../enums/typesense-logic-operator.enum.js'

interface TypesenseFilter {
  filter: string
  operator: TypesenseLogicOperator
}

type FilterFieldOrCallBack<Collection extends TypesenseCollection> = FilterField<Collection>
  | ((builder: TypesenseFilterParamsBuilder<Collection>) => void)

export class TypesenseFilterParamsBuilder<Collection extends TypesenseCollection> {
  private filters: TypesenseFilter[] = []
  private operator: TypesenseLogicOperator

  constructor (operator: TypesenseLogicOperator = TypesenseLogicOperator.AND) {
    this.operator = operator
  }

  where (
    filterField: FilterField<Collection>,
    values: string[] | undefined,
    options?: TypesenseFilterOptions
  ): this
  where (builderCallback: (builder: TypesenseFilterParamsBuilder<Collection>) => void): this
  where (
    filterFieldOrCallback: FilterFieldOrCallBack<Collection>,
    values?: string[],
    options?: TypesenseFilterOptions
  ): this {
    if (typeof filterFieldOrCallback === 'function') {
      return this.filterByField(filterFieldOrCallback)
    } else {
      return this.filterByField(filterFieldOrCallback, values, options)
    }
  }

  andWhere (
    filterField: FilterField<Collection>,
    values: string[] | undefined,
    options?: TypesenseFilterOptions
  ): this
  andWhere (builderCallback: (builder: TypesenseFilterParamsBuilder<Collection>) => void): this
  andWhere (
    filterFieldOrCallback: FilterFieldOrCallBack<Collection>,
    values?: string[],
    options?: TypesenseFilterOptions
  ): this {
    this.and()

    if (typeof filterFieldOrCallback === 'function') {
      return this.where(filterFieldOrCallback)
    } else {
      return this.where(filterFieldOrCallback, values, options)
    }
  }

  orWhere (
    filterField: FilterField<Collection>,
    values: string[] | undefined,
    options?: TypesenseFilterOptions
  ): this
  orWhere (builderCallback: (builder: TypesenseFilterParamsBuilder<Collection>) => void): this
  orWhere (
    filterFieldOrCallback: FilterFieldOrCallBack<Collection>,
    values?: string[],
    options?: TypesenseFilterOptions
  ): this {
    this.or()

    if (typeof filterFieldOrCallback === 'function') {
      return this.where(filterFieldOrCallback)
    } else {
      return this.where(filterFieldOrCallback, values, options)
    }
  }

  build (): string {
    if (this.filters.length === 0) return ''

    return this.filters
      .map((filter, index) => (index === 0 ? filter.filter : `${filter.operator} ${filter.filter}`))
      .join(' ')
  }

  private and (): this {
    this.operator = TypesenseLogicOperator.AND

    return this
  }

  private or (): this {
    this.operator = TypesenseLogicOperator.OR

    return this
  }

  private filterByField (
    filterField: FilterField<Collection>,
    values: string[] | undefined,
    options?: TypesenseFilterOptions
  ): this
  private filterByField (
    builderCallback: (builder: TypesenseFilterParamsBuilder<Collection>) => void
  ): this
  private filterByField (
    filterFieldOrCallback: FilterFieldOrCallBack<Collection>,
    values?: string[],
    options?: TypesenseFilterOptions
  ): this {
    if (typeof filterFieldOrCallback === 'function') {
      const builder = new TypesenseFilterParamsBuilder<Collection>()

      filterFieldOrCallback(builder)
      this.filters.push({
        filter: `(${builder.build()})`,
        operator: this.operator
      })
    } else {
      if (values !== undefined) {
        const joinedValue = values.join(',')
        const value = values.length > 1 ? `[${joinedValue}]` : joinedValue

        this.filters.push({
          filter: `${filterFieldOrCallback}:${this.getOperator(options)}${value}`,
          operator: this.operator
        })
      }
    }

    return this
  }

  private getOperator (options?: TypesenseFilterOptions): string {
    return options ?? TypesenseFilterOptions.EQUALS
  }
}
