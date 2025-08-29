import { Module } from '@nestjs/common'
import { TypesenseClientModule } from '../../client/typesense-client.module.js'
import { ViewNaturalLanguageModelIndexUseCase } from './view-nl-search-model-index.use-case.js'
import { ViewNaturalLanguageModelIndexController } from './view-nl-search-model-index.controller.js'

@Module({
  imports: [
    TypesenseClientModule
  ],
  controllers: [
    ViewNaturalLanguageModelIndexController
  ],
  providers: [
    ViewNaturalLanguageModelIndexUseCase
  ]
})
export class TypesenseViewNaturalLanguageIndexModule {}
