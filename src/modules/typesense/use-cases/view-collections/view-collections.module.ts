import { Module } from '@nestjs/common'
import { TypesenseClient } from '../../clients/typesense.client.js'
import { ViewCollectionsController } from './view-collections.controller.js'
import { ViewCollectionsUseCase } from './view-collections.use-case.js'

@Module({
  controllers: [ViewCollectionsController],
  providers: [
    ViewCollectionsUseCase,
    TypesenseClient
  ]
})
export class ViewCollectionsModule {}
