import { TypesenseCollectionName } from '../../../modules/typesense/collections/typesense-collection-name.enum.js'
import { RegisterTypesenseCollection } from '../../../modules/typesense/collections/typesense-collection.decorator.js'
import { TypesenseCollection } from '../../../modules/typesense/collections/typesense.collection.js'

@RegisterTypesenseCollection(TypesenseCollectionName.GSE)
export class GseTypesenseCollection extends TypesenseCollection {
  readonly name = TypesenseCollectionName.GSE

  readonly searchableFields = [
    { name: 'location', type: 'geopoint' },
    { name: 'type', type: 'string' },
    { name: 'soc', type: 'float' },
    { name: 'temperatureCelsius', type: 'float' }
  ] as const

  readonly filterableFields = [
  ] as const

  readonly referenceFields = [
    { name: 'airportUuid', type: 'string', collectionName: TypesenseCollectionName.AIRPORT, optional: true }
  ] as const
}
