import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypesenseClient } from '../../client/typesense.client.js'
import { TYPESENSE_ENDPOINTS } from '../../helpers/typesense-endpoints.constants.js'
import { CreateNaturalLanguageModelCommand } from './create-nl-search-model.command.js'
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
  [AiModelName.GEMINI_1_5_PRO]: 'GEMINI_API_KEY',
  [AiModelName.GEMINI_2_5_FLASH_LITE]: 'GEMINI_API_KEY'
}

@Injectable()
export class CreateNaturalLanguageSearchModelUseCase {
  constructor (
    private readonly typesenseClient: TypesenseClient,
    private readonly configService: ConfigService
  ) {}

  async execute (
    command: CreateNaturalLanguageModelCommand
  ): Promise<void> {
    const url = TYPESENSE_ENDPOINTS.CREATE_NATURAL_LANGUAGE_MODEL

    const apiKeyEnvVariable = this.getApiKeyEnvVariable(command.modelName)
    const key = this.configService.getOrThrow<string>(apiKeyEnvVariable)

    const body: CreateNaturalLanguageModel = {
      id: command.modelId,
      model_name: command.modelName,
      api_key: key,
      max_bytes: 1600,
      temperature: 0
    }

    await this.typesenseClient.client.apiCall.post(url, body)
  }

  private getApiKeyEnvVariable (
    model: AiModelName
  ): string {
    return modelToApiKey[model]
  }
}
