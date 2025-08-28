import { TypesenseCollectionName } from '../../../modules/typesense/collections/typesense-collection-name.enum.js'
import { RegisterTypesenseCollection } from '../../../modules/typesense/collections/typesense-collection.decorator.js'
import { TypesenseCollection } from '../../../modules/typesense/collections/typesense.collection.js'

@RegisterTypesenseCollection(TypesenseCollectionName.AIRPORT)
export class AirportTypesenseCollection extends TypesenseCollection {
  readonly name = TypesenseCollectionName.AIRPORT

  readonly searchableFields = [
    { name: 'name', type: 'string', sort: true, infix: true },
    { name: 'code', type: 'string', sort: true }
  ] as const

  readonly filterableFields = [] as const

  readonly referenceFields = [] as const
}
