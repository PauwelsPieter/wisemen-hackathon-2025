import { Injectable } from '@nestjs/common'
import { TypesenseClient } from '../../client/typesense.client.js'
import { ViewNaturalLanguageModelIndex } from './view-nl-search-model-index.response.js'

@Injectable()
export class ViewNaturalLanguageModelIndexUseCase {
  constructor (
    private readonly typesenseClient: TypesenseClient
  ) {}

  async execute (): Promise<ViewNaturalLanguageModelIndex> {
    // await this.typesenseClient.client.nlSearchModels().retrieve()

    return Promise.resolve(new ViewNaturalLanguageModelIndex())
  }
}
