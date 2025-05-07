import { Injectable } from '@nestjs/common'
import { captureException } from '@sentry/nestjs'
import { TypesenseCollectionName } from '../../collections/typesense-collection-name.enum.js'
import { TypesenseCollectors } from '../../collectors/typesense-collectors.js'
import { TypesenseClient } from '../../client/typesense.client.js'

@Injectable()
export class ImportCollectionsUseCase {
  constructor (
    private readonly typesenseClient: TypesenseClient,
    private readonly collectors: TypesenseCollectors
  ) {}

  public async execute (indexes: TypesenseCollectionName[]): Promise<void> {
    for (const collection of indexes) {
      await this.importCollection(collection)
    }
  }

  private async importCollection (collection: TypesenseCollectionName): Promise<void> {
    const collector = this.collectors.get(collection)

    const entities = await collector.fetch()

    await this.addDocuments(collection, collector.transform(entities))
  }

  private async addDocuments <T extends object> (
    index: TypesenseCollectionName,
    documents: T[]
  ): Promise<void> {
    for (let i = 0; i < documents.length; i += 100) {
      const documentsChunk = documents.slice(i, i + 100)

      try {
        const alias = await this.typesenseClient.client.aliases(index).retrieve()
        const collectionName = alias.collection_name
        const collection = this.typesenseClient.client.collections(collectionName)

        await collection.documents().import(documentsChunk, { action: 'upsert' })
      } catch (e) {
        captureException(e)
        throw e
      }
    }
  }
}
