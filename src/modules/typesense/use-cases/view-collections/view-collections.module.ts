import { Module } from '@nestjs/common'
import { TypesenseClientModule } from '../../client/typesense-client.module.js'
import { ViewCollectionsController } from './view-collections.controller.js'
import { ViewCollectionsUseCase } from './view-collections.use-case.js'

@Module({
  imports: [TypesenseClientModule],
  controllers: [ViewCollectionsController],
  providers: [ViewCollectionsUseCase]
})
export class ViewCollectionsModule {}
