import { Injectable } from '@nestjs/common'
import { TypesenseClient } from '../../client/typesense.client.js'
import { TYPESENSE_ENDPOINTS } from '../../helpers/typesense-endpoints.constants.js'

interface CreateNaturalLanguageModel {
  id: string
  model_name: string
  api_key: string
  max_bytes: number
  temperature: number
}

@Injectable()
export class CreateNaturalLanguageSearchModelUseCase {
  constructor (
    private readonly typesenseClient: TypesenseClient
  ) {}

  async execute (): Promise<void> {
    const url = TYPESENSE_ENDPOINTS.CREATE_NATURAL_LANGUAGE_MODEL

    const body: CreateNaturalLanguageModel = {
      id: 'gemini-model',
      model_name: 'google/gemini-2.0-flash',
      api_key: '',
      max_bytes: 1600,
      temperature: 0
    }

    await this.typesenseClient.client.apiCall.post(url, body)
  }
}
