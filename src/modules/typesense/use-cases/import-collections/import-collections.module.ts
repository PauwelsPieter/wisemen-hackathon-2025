import { Module } from '@nestjs/common'
import { TypesenseClientModule } from '../../client/typesense-client.module.js'
import { TypesenseCollectorsModule } from '../../collectors/typesense-collectors.module.js'
import { ImportCollectionsUseCase } from './import-collections.use-case.js'
import { ImportCollectionsController } from './import-collections.controller.js'

@Module({
  imports: [
    TypesenseClientModule,
    TypesenseCollectorsModule
  ],
  controllers: [ImportCollectionsController],
  providers: [ImportCollectionsUseCase]
})
export class ImportCollectionsModule {}
