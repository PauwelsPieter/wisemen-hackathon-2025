import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js'
import { captureException } from '@sentry/nestjs'
import { TypesenseCollectionName } from '../../enums/typesense-collection-index.enum.js'
import { TypesenseClient } from '../../clients/typesense.client.js'
import { TypesenseCollectorFactory } from '../../services/collectors/typesense-collector.factory.js'
import { UserTypesenseCollection } from '../../collections/user.collections.js'

@Injectable()
export class MigrateCollectionsUseCase {
  constructor (
    private readonly typesenseClient: TypesenseClient,
    private readonly collectorFactory: TypesenseCollectorFactory
  ) {}

  async execute (fresh: boolean, indexes: TypesenseCollectionName[]): Promise<void> {
    if (indexes.includes(TypesenseCollectionName.USER)) {
      await this.migrateCollection(
        TypesenseCollectionName.USER,
        new UserTypesenseCollection().getSchema(),
        fresh
      )
    }
  }

  private async migrateCollection (
    aliasName: TypesenseCollectionName,
    createCollection: CollectionCreateSchema,
    fresh: boolean
  ): Promise<void> {
    const exists = await this.aliasExists(aliasName)

    if (fresh || !exists) {
      const collection = await this.createCollection(createCollection)

      await this.linkAlias(aliasName, collection.name)
      await this.import(aliasName)
      await this.deleteUnusedCollections()
    }
  }

  private async import (
    collection: TypesenseCollectionName,
    uuids?: string[]
  ): Promise<void> {
    const collector = this.collectorFactory.create(collection)

    const entities = await collector.fetch(uuids)

    await this.addDocuments(
      collection,
      collector.transform(entities)
    )
  }

  async addDocuments <T extends object> (
    index: TypesenseCollectionName,
    documents: T[],
    collectionName?: string
  ): Promise<void> {
    for (let i = 0; i < documents.length; i += 100) {
      const documentsChunk = documents.slice(i, i + 100)

      try {
        if (collectionName == null) {
          collectionName = (await this.typesenseClient.client.aliases(index).retrieve())
            .collection_name
        }

        await this.typesenseClient.client.collections(collectionName).documents().import(documentsChunk, { action: 'upsert' })
      } catch (e) {
        captureException(e)
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
}
