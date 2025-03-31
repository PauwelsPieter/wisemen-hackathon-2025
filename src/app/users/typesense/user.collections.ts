import { TypesenseCollectionName } from '../../../modules/typesense/enums/typesense-collection-index.enum.js'
import { TypesenseCollection } from '../../../modules/typesense/collections/abstract-typesense.collection.js'

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
