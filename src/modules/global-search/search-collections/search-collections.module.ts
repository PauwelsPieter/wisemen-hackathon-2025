import { Module } from '@nestjs/common'
import { TypesenseModule } from '../../typesense/typesense.module.js'
import { SearchCollectionsController } from './search-collections.controller.js'
import { SearchCollectionsUseCase } from './search-collections.use-case.js'

@Module({
  imports: [
    TypesenseModule
  ],
  controllers: [SearchCollectionsController],
  providers: [SearchCollectionsUseCase]
})
export class SearchCollectionsModule {}
