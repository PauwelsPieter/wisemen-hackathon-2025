import { TypesenseCollectionName } from '../../../modules/typesense/collections/typesense-collection-name.enum.js'
import { RegisterTypesenseCollection } from '../../../modules/typesense/collections/typesense-collection.decorator.js'
import { TypesenseCollection } from '../../../modules/typesense/collections/typesense.collection.js'

@RegisterTypesenseCollection(TypesenseCollectionName.PLANNING)
export class PlanningTypesenseCollection extends TypesenseCollection {
  readonly name = TypesenseCollectionName.PLANNING

  readonly searchableFields = [
    { name: 'id', type: 'string' }
  ] as const

  readonly filterableFields = [
    { name: 'from', type: 'int64' },
    { name: 'to', type: 'int64' }
  ] as const

  readonly referenceFields = [] as const
}
