import { Injectable } from '@nestjs/common'
import { TypesenseCollectionName } from '../../enums/typesense-collection-index.enum.js'
import { exhaustiveCheck } from '../../../../utils/helpers/exhaustive-check.helper.js'
import { UserTypesenseCollector } from '../../../../app/users/typesense/user-typesense.collector.js'
import { ContactTypesenseCollector } from '../../../../app/contact/typesense/contact.typesense-collector.js'

@Injectable()
export class TypesenseCollectorFactory {
  constructor (
    private readonly userTypeSenseCollector: UserTypesenseCollector,
    private readonly contactTypeSenseCollector: ContactTypesenseCollector
  ) {}

  public create (collection: TypesenseCollectionName): TypesenseCollector {
    switch (collection) {
      case TypesenseCollectionName.USER: return this.userTypeSenseCollector
      case TypesenseCollectionName.CONTACT: return this.contactTypeSenseCollector
      default: exhaustiveCheck(collection)
    }
  }
}

export interface TypesenseCollector {
  transform: (entities: unknown[]) => object[]
  fetch: (uuids?: string[]) => Promise<unknown[]>
  fetchChanged: (since: Date) => Promise<unknown[]>
  fetchRemoved: (since: Date) => Promise<string[]>
}
