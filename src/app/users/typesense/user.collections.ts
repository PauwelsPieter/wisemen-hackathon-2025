import { TypesenseCollectionName } from '../../../modules/typesense/collections/typesense-collection-name.enum.js'
import { RegisterTypesenseCollection } from '../../../modules/typesense/collections/typesense-collection.decorator.js'
import { TypesenseCollection } from '../../../modules/typesense/collections/typesense.collection.js'

@RegisterTypesenseCollection(TypesenseCollectionName.USER)
export class UserTypesenseCollection extends TypesenseCollection {
  readonly name = TypesenseCollectionName.USER

  readonly searchableFields = [
    { name: 'firstName', type: 'string', sort: true, infix: true },
    { name: 'lastName', type: 'string', sort: true, infix: true },
    { name: 'email', type: 'string', sort: true, infix: true }
  ] as const

  readonly filterableFields = [] as const

  readonly referenceFields = [] as const
}
