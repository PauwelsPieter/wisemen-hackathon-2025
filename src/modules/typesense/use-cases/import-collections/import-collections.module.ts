import { Module } from '@nestjs/common'
import { TypesenseClient } from '../../clients/typesense.client.js'
import { TypesenseCollectorFactory } from '../../services/collectors/typesense-collector.factory.js'
import { UserTypesenseModule } from '../../../../app/users/typesense/user-typesense.module.js'
import { ImportCollectionsUseCase } from './import-collections.use-case.js'
import { ImportCollectionsController } from './import-collections.controller.js'

@Module({
  imports: [
    UserTypesenseModule
  ],
  controllers: [ImportCollectionsController],
  providers: [
    ImportCollectionsUseCase,
    TypesenseClient,
    TypesenseCollectorFactory
  ]
})
export class ImportCollectionsModule {}
