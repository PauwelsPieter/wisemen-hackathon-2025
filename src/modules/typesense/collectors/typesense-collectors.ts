import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { TypesenseCollectionName } from '../collections/typesense-collection-name.enum.js'
import { ProvidersExplorer } from '../../../utils/providers/providers-explorer.js'
import { TypesenseCollector } from './typesense-collector.js'
import { isTypesenseCollector, getTypesenseCollectorCollection } from './typesense-collector.decorator.js'

@Injectable()
export class TypesenseCollectors implements OnApplicationBootstrap {
  private readonly collectors = new Map<TypesenseCollectionName, TypesenseCollector>()

  constructor (
    private readonly providersExplorer: ProvidersExplorer
  ) {}

  onApplicationBootstrap () {
    for (const provider of this.providersExplorer.providers) {
      if (isTypesenseCollector(provider.providerClass)) {
        const collectionName = getTypesenseCollectorCollection(provider.providerClass)
        this.collectors.set(collectionName, provider.providerInstance as TypesenseCollector)
      }
    }
  }

  get (collection: TypesenseCollectionName): TypesenseCollector {
    const collector = this.collectors.get(collection)

    if (collector === undefined) {
      throw new Error(`No collector set for ${collection}`
        + `\n - Did you forget to add a @RegisterTypesenseCollector(TypesenseCollectionName.${collection})?`
        + `\n - Did you forget to add the collector as a provider in the collector's typesense module?`
        + ` \n - Did you forget to import the collector's module in the typesense module?`)
    }

    return collector
  }
}
