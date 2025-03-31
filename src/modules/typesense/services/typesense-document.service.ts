import { Injectable } from '@nestjs/common'
import type { TypesenseCollectionName } from '../enums/typesense-collection-index.enum.js'
import { TypesenseClient } from '../clients/typesense.client.js'

@Injectable()
export class TypesenseDocumentService {
  constructor (
    private readonly typesenseClient: TypesenseClient
  ) {}

  async addDocuments <T extends object> (
    index: TypesenseCollectionName,
    documents: T[],
    collectionName?: string
  ): Promise<void> {
    if (documents.length === 0) {
      return
    }

    if (collectionName == null) {
      const alias = await this.typesenseClient.client.aliases(index).retrieve()

      collectionName = alias.collection_name
    }

    await this.typesenseClient.client
      .collections(collectionName)
      .documents()
      .import(documents, { batch_size: 100, action: 'upsert' })
  }

  async deleteDocuments (index: TypesenseCollectionName, uuids: string[]): Promise<void> {
    if (uuids.length === 0) {
      return
    }

    await this.typesenseClient.client
      .collections(index)
      .documents()
      .delete({
        filter_by: `uuid: [${uuids.join(',')}]`,
        batch_size: 100,
        ignore_not_found: true
      })
  }

  public async deleteDocument (index: TypesenseCollectionName, uuid: string): Promise<void> {
    await this.typesenseClient.client.collections(index).documents(uuid).delete()
  }

  public async truncateCollection (index: TypesenseCollectionName): Promise<void> {
    await this.typesenseClient.client
      .collections(index)
      .documents()
      .delete({ truncate: true })
  }
}
