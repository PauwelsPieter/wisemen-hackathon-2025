import { Injectable } from '@nestjs/common'
import { captureException } from '@sentry/nestjs'
import { TypesenseCollectionName } from '../../enums/typesense-collection-index.enum.js'
import { TypesenseCollectorFactory } from '../../services/collectors/typesense-collector.factory.js'
import { TypesenseClient } from '../../clients/typesense.client.js'

@Injectable()
export class ImportCollectionsUseCase {
  constructor (
    private readonly typesenseClient: TypesenseClient,
    private readonly collectorFactory: TypesenseCollectorFactory
  ) {}

  public async execute (indexes: TypesenseCollectionName[]): Promise<void> {
    if (indexes.includes(TypesenseCollectionName.USER)) {
      await this.importCollection(TypesenseCollectionName.USER)
    }
  }

  private async importCollection (collection: TypesenseCollectionName) {
    const collector = this.collectorFactory.create(collection)

    const entities = await collector.fetch()

    await this.addDocuments(
      collection,
      collector.transform(entities)
    )
  }

  private async addDocuments <T extends object> (index: TypesenseCollectionName,
    documents: T[]) {
    for (let i = 0; i < documents.length; i += 100) {
      const documentsChunk = documents.slice(i, i + 100)

      try {
        const collectionName = (await this.typesenseClient.client.aliases(index).retrieve())
          .collection_name

        await this.typesenseClient.client.collections(collectionName).documents().import(documentsChunk, { action: 'upsert' })
      } catch (e) {
        captureException(e)
      }
    }
  }
}
