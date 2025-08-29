import { AiModelName } from '../use-cases/create-nl-search-model/ai-model.enum.js'

export class AiSearchModelMapper {
  static map (modelName: string): AiModelName {
    switch (modelName) {
      case 'google/gemini-2.0-flash':
        return AiModelName.GEMINI_2_0_FLASH
      case 'google/gemini-2.5-flash':
        return AiModelName.GEMINI_2_5_FLASH
      // case 'google/gemini-1.5-pro':
      //   return AiModelName.GEMINI_1_5_PRO
      case 'google/gemini-2.5-flash-lite':
        return AiModelName.GEMINI_2_5_FLASH_LITE
      default:
        return AiModelName.GEMINI_2_0_FLASH
    }
  }
}
