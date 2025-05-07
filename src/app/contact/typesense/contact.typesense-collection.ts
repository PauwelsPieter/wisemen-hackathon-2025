import { TypesenseCollection } from '../../../modules/typesense/collections/typesense.collection.js'
import { TypesenseCollectionName } from '../../../modules/typesense/collections/typesense-collection-name.enum.js'
import { RegisterTypesenseCollection } from '../../../modules/typesense/collections/typesense-collection.decorator.js'

@RegisterTypesenseCollection(TypesenseCollectionName.CONTACT)
export class ContactTypesenseCollection extends TypesenseCollection {
  readonly name = TypesenseCollectionName.CONTACT

  readonly searchableFields = [
    { name: 'name', type: 'string', sort: true, infix: true },
    { name: 'email', type: 'string', sort: true, infix: true, optional: true },
    { name: 'phone', type: 'string', sort: true, infix: true, optional: true },
    { name: 'country', type: 'string', optional: true, index: false },
    { name: 'city', type: 'string', optional: true, index: false },
    { name: 'postalCode', type: 'string', optional: true, index: true },
    { name: 'streetName', type: 'string', optional: true, index: false },
    { name: 'streetNumber', type: 'string', optional: true, index: false },
    { name: 'unit', type: 'string', optional: true, index: false },
    { name: 'coordinates', type: 'geopoint', optional: true }
  ] as const

  readonly filterableFields = [
    { name: 'isActive', type: 'bool', optional: true }
  ] as const

  readonly referenceFields = [] as const
}
