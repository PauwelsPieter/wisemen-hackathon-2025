import { exhaustiveCheck } from '../../../utils/helpers/exhaustive-check.helper.js'
import { TypesenseCollectionName } from '../collections/typesense-collection-name.enum.js'
import { ReferenceField, TypesenseCollection } from '../collections/typesense.collection.js'
import { TypesenseJoinStrategy } from './enums/typesense-join-strategy.enum.js'
import { TypesenseJoinType } from './enums/typesense-join-type.enum.js'

export interface TypesenseJoinParams {
  fields: string
  filter?: string
}

export interface TypesenseJoinOptions {
  strategy?: TypesenseJoinStrategy
  select?: string[]
  alias?: string
}

export class TypesenseJoinParamsBuilder<Collection extends TypesenseCollection> {
  build (
    type: TypesenseJoinType,
    target: ReferenceField<Collection> | TypesenseCollectionName,
    filterBy?: string,
    options?: TypesenseJoinOptions
  ): TypesenseJoinParams {
    const joinStrategy = options?.strategy ?? TypesenseJoinStrategy.NEST

    const fields = this.buildFields(target, options?.select, options?.alias, joinStrategy)
    const filter = this.buildFilter(type, target, filterBy)

    return {
      fields,
      filter
    }
  }

  private buildFilter (
    type: TypesenseJoinType,
    target: ReferenceField<Collection> | TypesenseCollectionName,
    filterBy?: string
  ): string | undefined {
    switch (type) {
      case TypesenseJoinType.INNER:
        return `$${target}(id: *)`
      case TypesenseJoinType.LEFT:
        return `(id:* || $${target}(id: *))`
      case TypesenseJoinType.INVERSE:
        if (filterBy != null) {
          return `$${target}(${filterBy})`
        } else {
          throw new Error(`Filter by is required for ${type} join type. Please provide a filterBy parameter`)
        }
      default:
        exhaustiveCheck(type)
    }
  }

  private buildFields (
    target: string,
    select?: string[],
    alias?: string,
    strategy: TypesenseJoinStrategy = TypesenseJoinStrategy.NEST
  ): string {
    const fields = select?.join(',') ?? '*'
    const outputAlias = alias ?? target

    return `$${target}(${fields}, strategy: ${strategy}) as ${outputAlias}`
  }
}
