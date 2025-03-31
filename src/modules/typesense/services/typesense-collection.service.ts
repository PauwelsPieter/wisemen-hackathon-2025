import { Injectable } from '@nestjs/common'
import type { TypesenseCollectionName } from '../enums/typesense-collection-index.enum.js'
import { TypesenseCollectorFactory } from './collectors/typesense-collector.factory.js'
import { TypesenseDocumentService } from './typesense-document.service.js'

@Injectable()
export class TypesenseCollectionService {
  constructor (
    private readonly typesenseDocumentService: TypesenseDocumentService,
    private readonly collectorFactory: TypesenseCollectorFactory
  ) {}

  async importManually<T> (
    collection: TypesenseCollectionName,
    objects: T[]
  ): Promise<void> {
    const collector = this.collectorFactory.create(collection)

    await this.typesenseDocumentService.addDocuments(
      collection,
      collector.transform(objects)
    )
  }

  async import (collection: TypesenseCollectionName, uuids?: string[]): Promise<void> {
    const collector = this.collectorFactory.create(collection)

    const entities = await collector.fetch(uuids)

    await this.typesenseDocumentService.addDocuments(
      collection,
      collector.transform(entities)
    )
  }

  async importChanged (collection: TypesenseCollectionName, since: Date): Promise<void> {
    const collector = this.collectorFactory.create(collection)
    const entities = await collector.fetchChanged(since)

    await this.typesenseDocumentService.addDocuments(
      collection,
      collector.transform(entities)
    )
  }

  async deleteRemoved (collection: TypesenseCollectionName, since: Date): Promise<void> {
    const collector = this.collectorFactory.create(collection)
    const uuids = await collector.fetchRemoved(since)

    await this.typesenseDocumentService.deleteDocuments(collection, uuids)
  }

  async delete (collection: TypesenseCollectionName, uuid: string): Promise<void> {
    await this.typesenseDocumentService.deleteDocument(collection, uuid)
  }

  async truncate (collections: TypesenseCollectionName[]): Promise<void> {
    for (const collection of collections) {
      await this.typesenseDocumentService.truncateCollection(collection)
    }
  }
}
