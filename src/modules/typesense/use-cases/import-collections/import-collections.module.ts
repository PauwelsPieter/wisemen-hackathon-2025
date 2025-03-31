import { Module } from '@nestjs/common'
import { TypesenseClient } from '../../clients/typesense.client.js'
import { TypesenseCollectorFactory } from '../../services/collectors/typesense-collector.factory.js'
import { UserTypesenseCollectorModule } from '../../../../app/users/typesense/user-typesense-collector.module.js'
import { ImportCollectionsUseCase } from './import-collections.use-case.js'
import { ImportCollectionsController } from './import-collections.controller.js'

@Module({
  imports: [
    UserTypesenseCollectorModule
  ],
  controllers: [ImportCollectionsController],
  providers: [
    ImportCollectionsUseCase,
    TypesenseClient,
    TypesenseCollectorFactory
  ]
})
export class ImportCollectionsModule {}
