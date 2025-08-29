import { Injectable } from '@nestjs/common'
import { TypesenseClient } from '../../client/typesense.client.js'
import { AiModelName } from '../create-nl-search-model/ai-model.enum.js'
import { AiSearchModelMapper } from '../../helpers/ai-search-model.mapper.js'
import { ViewNaturalLanguageModelIndex } from './view-nl-search-model-index.response.js'

export interface SearchModel {
  modelId: string
  modelName: AiModelName
}

@Injectable()
export class ViewNaturalLanguageModelIndexUseCase {
  constructor (
    private readonly typesenseClient: TypesenseClient
  ) {}

  async execute (): Promise<ViewNaturalLanguageModelIndex> {
    const response = await this.typesenseClient.client.nlSearchModels().retrieve()

    const models: SearchModel[] = response.map((model) => {
      return {
        modelId: model.id,
        modelName: AiSearchModelMapper.map(model.model_name)
      }
    })

    return new ViewNaturalLanguageModelIndex(models)
  }
}
