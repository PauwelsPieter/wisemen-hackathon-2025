import { TypesenseCollectionName } from '../../../modules/typesense/collections/typesense-collection-name.enum.js'
import { RegisterTypesenseCollection } from '../../../modules/typesense/collections/typesense-collection.decorator.js'
import { TypesenseCollection } from '../../../modules/typesense/collections/typesense.collection.js'

@RegisterTypesenseCollection(TypesenseCollectionName.GSE)
export class GseTypesenseCollection extends TypesenseCollection {
  readonly name = TypesenseCollectionName.GSE

  readonly searchableFields = [
    { name: 'type', type: 'string' }
  ] as const

  readonly filterableFields = [
    { name: 'location', type: 'geopoint' },
    { name: 'soc', type: 'float' },
    { name: 'temperature', type: 'float' }
  ] as const

  readonly referenceFields = [
    { name: 'airportUuid', type: 'string', collectionName: TypesenseCollectionName.AIRPORT, optional: true }
  ] as const
}
