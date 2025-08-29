import { ApiProperty } from '@nestjs/swagger'
import { AiModelName } from '../create-nl-search-model/ai-model.enum.js'

class NaturalLanguageModel {
  @ApiProperty({ type: String })
  modelId: string

  @ApiProperty({ type: String, enum: AiModelName, enumName: 'AiModelName' })
  modelName: AiModelName
}

export class ViewNaturalLanguageModelIndex {
  @ApiProperty({ type: NaturalLanguageModel, isArray: true })
  models: NaturalLanguageModel[]

  constructor () {
    this.models = []
  }
}
