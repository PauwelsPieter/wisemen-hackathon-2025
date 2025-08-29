import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypesenseClient } from '../../client/typesense.client.js'
import { TYPESENSE_ENDPOINTS } from '../../helpers/typesense-endpoints.constants.js'
import { SearchModel } from '../../helpers/search-model.type.js'
import { AiSearchModelMapper } from '../../helpers/ai-search-model.mapper.js'
import { AiModelName } from './ai-model.enum.js'

interface CreateNaturalLanguageModel {
  id: string
  model_name: string
  api_key: string
  max_bytes: number
  temperature: number
}

const modelToApiKey: Record<AiModelName, string> = {
  [AiModelName.GEMINI_2_0_FLASH]: 'GEMINI_API_KEY',
  [AiModelName.GEMINI_2_5_FLASH]: 'GEMINI_API_KEY',
  // [AiModelName.GEMINI_1_5_PRO]: 'GEMINI_API_KEY',
  [AiModelName.GEMINI_2_5_FLASH_LITE]: 'GEMINI_API_KEY'
}

@Injectable()
export class CreateNaturalLanguageSearchModelUseCase {
  constructor (
    private readonly typesenseClient: TypesenseClient,
    private readonly configService: ConfigService
  ) {}

  async execute (): Promise<void> {
    const missingModels = await this.fetchMissingSearchModels()

    if (missingModels.length > 0) {
      await this.createSearchModels(missingModels)
    }
  }

  private async createSearchModels (
    models: AiModelName[]
  ): Promise<void> {
    const url = TYPESENSE_ENDPOINTS.CREATE_NATURAL_LANGUAGE_MODEL

    await Promise.all(
      models.map(async (model) => {
        const apiKeyEnvVariable = this.getApiKeyEnvVariable(model)
        const key = this.configService.getOrThrow<string>(apiKeyEnvVariable)

        const body: CreateNaturalLanguageModel = {
          id: model,
          model_name: model,
          api_key: key,
          max_bytes: 1600,
          temperature: 0
        }

        await this.typesenseClient.client.apiCall.post(url, body)
      }))
  }

  private async fetchMissingSearchModels (): Promise<AiModelName[]> {
    const response = await this.typesenseClient.client.nlSearchModels().retrieve()

    const models: SearchModel[] = response.map((model) => {
      return {
        modelId: model.id,
        modelName: AiSearchModelMapper.map(model.model_name)
      }
    })

    const modelNames = models.map(model => model.modelName)

    const missingModels = Object.values(AiModelName).filter((aiModelName) => {
      return !modelNames.includes(aiModelName)
    })

    return missingModels
  }

  private getApiKeyEnvVariable (
    model: AiModelName
  ): string {
    return modelToApiKey[model]
  }
}
