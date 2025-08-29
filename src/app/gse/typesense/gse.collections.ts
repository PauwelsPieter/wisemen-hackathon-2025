import { TypesenseCollectionName } from '../../../modules/typesense/collections/typesense-collection-name.enum.js'
import { RegisterTypesenseCollection } from '../../../modules/typesense/collections/typesense-collection.decorator.js'
import { TypesenseCollection } from '../../../modules/typesense/collections/typesense.collection.js'

@RegisterTypesenseCollection(TypesenseCollectionName.GSE)
export class GseTypesenseCollection extends TypesenseCollection {
  readonly name = TypesenseCollectionName.GSE

  readonly searchableFields = [
    { name: 'airportName', type: 'string', optional: true, infix: true },
    { name: 'type', type: 'string' }
  ] as const

  readonly filterableFields = [
    { name: 'airportUuid', type: 'string', optional: true },
    { name: 'airportCode', type: 'string', optional: true },
    { name: 'soc', type: 'float' },
    { name: 'temperature', type: 'float' }
  ] as const

  readonly referenceFields = [] as const
}
