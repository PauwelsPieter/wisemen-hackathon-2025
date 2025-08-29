import { Module, OnModuleInit } from '@nestjs/common'
import { TypesenseClientModule } from '../../client/typesense-client.module.js'
import { CreateNaturalLanguageSearchModelUseCase } from './create-nl-search-model.use-case.js'

@Module({
  imports: [
    TypesenseClientModule
  ],
  providers: [
    CreateNaturalLanguageSearchModelUseCase
  ]
})
export class TypesenseCreateNlSearchModule implements OnModuleInit {
  constructor (
    private readonly createNlSearchModelUseCase: CreateNaturalLanguageSearchModelUseCase
  ) {}

  async onModuleInit () {
    await this.createNlSearchModelUseCase.execute()
  }
}
