import { Module } from '@nestjs/common'
import { TypesenseClientModule } from '../../client/typesense-client.module.js'
import { CreateNaturalLanguageSearchModelUseCase } from './create-nl-search-model.use-case.js'
import { CreateNaturalLanguageSearchModelController } from './create-nl-search-model.controller.js'

@Module({
  imports: [
    TypesenseClientModule
  ],
  controllers: [
    CreateNaturalLanguageSearchModelController
  ],
  providers: [
    CreateNaturalLanguageSearchModelUseCase
  ]
})
export class TypesenseCreateNlSearchModule {}
