import { Injectable } from '@nestjs/common'
import type { CollectionSchema } from 'typesense/lib/Typesense/Collection.js'
import { TypesenseClient } from '../../client/typesense.client.js'

@Injectable()
export class ViewCollectionsUseCase {
  constructor (private readonly typesenseClient: TypesenseClient) {}

  async execute (): Promise<CollectionSchema[]> {
    return await this.typesenseClient.client.collections().retrieve()
  }
}
