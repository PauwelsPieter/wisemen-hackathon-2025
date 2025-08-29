import { AiModelName } from '../use-cases/create-nl-search-model/ai-model.enum.js'

export interface SearchModel {
  modelId: string
  modelName: AiModelName
}
