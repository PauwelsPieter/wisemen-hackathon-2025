import { ApiProperty } from '@nestjs/swagger'
import { AiModelName } from '../create-nl-search-model/ai-model.enum.js'
import { SearchModel } from '../../helpers/search-model.type.js'

class NaturalLanguageModel {
  @ApiProperty({ type: String })
  modelId: string

  @ApiProperty({ type: String, enum: AiModelName, enumName: 'AiModelName' })
  modelName: AiModelName

  constructor (searchModel: SearchModel) {
    this.modelId = searchModel.modelId
    this.modelName = searchModel.modelName
  }
}

export class ViewNaturalLanguageModelIndex {
  @ApiProperty({ type: NaturalLanguageModel, isArray: true })
  models: NaturalLanguageModel[]

  constructor (searchModels: SearchModel[]) {
    this.models = searchModels.map(searchModel => new NaturalLanguageModel(searchModel))
  }
}
