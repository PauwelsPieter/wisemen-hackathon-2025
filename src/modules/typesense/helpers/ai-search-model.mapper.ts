import { AiModelName } from '../use-cases/create-nl-search-model/ai-model.enum.js'

export class AiSearchModelMapper {
  static map (modelName: string): AiModelName {
    switch (modelName) {
      case 'google/gemini-2.0-flash':
        return AiModelName.GEMINI
      default:
        return AiModelName.GEMINI
    }
  }
}
