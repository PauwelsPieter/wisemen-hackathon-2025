import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js'
import { captureException } from '@sentry/nestjs'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { TypesenseCollectionName } from '../../collections/typesense-collection-name.enum.js'
import { TypesenseClient } from '../../client/typesense.client.js'
import { TypesenseCollectors } from '../../collectors/typesense-collectors.js'
import { TypesenseSync } from '../sync-collection/typesense-sync.entity.js'
import { TypesenseCollections } from '../../collections/typesense-collections.js'

@Injectable()
export class MigrateCollectionsUseCase {
  constructor (
    private readonly typesenseClient: TypesenseClient,
    private readonly collectors: TypesenseCollectors,
    private readonly collections: TypesenseCollections,
    @InjectRepository(TypesenseSync) private readonly syncRepository: Repository<TypesenseSync>
  ) {}

  async execute (fresh: boolean, indexes: TypesenseCollectionName[]): Promise<void> {
    for (const collectionName of indexes) {
      const schema = this.collections.get(collectionName).getSchema()

      await this.migrateCollection(collectionName, schema, fresh)
    }
  }

  private async migrateCollection (
    aliasName: TypesenseCollectionName,
    createCollection: CollectionCreateSchema,
    fresh: boolean
  ): Promise<void> {
    const exists = await this.aliasExists(aliasName)

    if (fresh || !exists) {
      const syncedAt = new Date()
      const collection = await this.createCollection(createCollection)

      await this.linkAlias(aliasName, collection.name)
      await this.import(aliasName)
      await this.deleteUnusedCollections()
      await this.registerSynced(aliasName, syncedAt)
    }
  }

  private async import (
    collection: TypesenseCollectionName,
    uuids?: string[]
  ): Promise<void> {
    const collector = this.collectors.get(collection)

    const entities = await collector.fetch(uuids)

    await this.addDocuments(
      collection,
      collector.transform(entities)
    )
  }

  private async addDocuments <T extends object> (
    index: TypesenseCollectionName,
    documents: T[],
    collectionName?: string
  ): Promise<void> {
    for (let i = 0; i < documents.length; i += 100) {
      const documentsChunk = documents.slice(i, i + 100)

      try {
        const alias = this.typesenseClient.client.aliases(index)
        collectionName ??= (await alias.retrieve()).collection_name

        const collection = this.typesenseClient.client.collections(collectionName)

        await collection.documents().import(documentsChunk, { action: 'upsert' })
      } catch (e) {
        console.log(e)
        captureException(e)
        throw e
      }
    }
  }

  private async createCollection (collection: CollectionCreateSchema): Promise<{ name: string }> {
    collection.name = `${collection.name}_${dayjs().toISOString()}`

    return await this.typesenseClient.client.collections().create(collection)
  }

  private async deleteCollection (index: string): Promise<void> {
    await this.typesenseClient.client.collections(index).delete()
  }

  private async deleteUnusedCollections (): Promise<void> {
    const aliases = await this.retrieveAliases()
    const collections = await this.retrieveCollections()

    const inUseCollectionNames = aliases.map(alias => alias.collection_name)
    const existingCollectionNames = collections.map(collection => collection.name)

    for (const existingCollectionName of existingCollectionNames) {
      if (!inUseCollectionNames.includes(existingCollectionName)) {
        await this.deleteCollection(existingCollectionName)
      }
    }
  }

  private async aliasExists (index: string): Promise<boolean> {
    const aliases = await this.retrieveAliases()

    return aliases.some(alias => alias.name === index)
  }

  private async retrieveAliases (): Promise<Array<{ name: string, collection_name: string }>> {
    return (await this.typesenseClient.client.aliases().retrieve()).aliases
  }

  private async retrieveCollections (): Promise<Array<{ name: string }>> {
    return await this.typesenseClient.client.collections().retrieve()
  }

  private async linkAlias (aliasName: string, collectionName: string): Promise<void> {
    await this.typesenseClient.client.aliases().upsert(aliasName, {
      collection_name: collectionName
    })
  }

  private async registerSynced (collection: TypesenseCollectionName, on: Date): Promise<void> {
    await this.syncRepository.upsert(
      { collection, lastSyncedAt: on },
      { conflictPaths: { collection: true } }
    )
  }
}
