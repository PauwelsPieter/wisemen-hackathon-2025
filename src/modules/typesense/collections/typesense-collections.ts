import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { TypesenseCollectionName } from '../collections/typesense-collection-name.enum.js'
import { ProvidersExplorer } from '../../../utils/providers/providers-explorer.js'
import { TypesenseCollection } from './typesense.collection.js'
import { getTypesenseCollectionCollectionName, isTypesenseCollection } from './typesense-collection.decorator.js'

@Injectable()
export class TypesenseCollections implements OnApplicationBootstrap {
  private readonly collections = new Map<TypesenseCollectionName, TypesenseCollection>()

  constructor (
    private readonly providersExplorer: ProvidersExplorer
  ) {}

  onApplicationBootstrap () {
    for (const provider of this.providersExplorer.providers) {
      if (isTypesenseCollection(provider.providerClass)) {
        const collectionName = getTypesenseCollectionCollectionName(provider.providerClass)
        this.collections.set(collectionName, provider.providerInstance as TypesenseCollection)
      }
    }
  }

  get (collectionName: TypesenseCollectionName): TypesenseCollection {
    const collection = this.collections.get(collectionName)

    if (collection === undefined) {
      throw new Error(`No collector set for ${collectionName}`
        + `\n - Did you forget to add a @RegisterTypesenseCollector(TypesenseCollectionName.${collection})?`
        + `\n - Did you forget to add the collector as a provider in the collector's typesense module?`
        + ` \n - Did you forget to import the collector's module in the typesense module?`)
    }

    return collection
  }
}
