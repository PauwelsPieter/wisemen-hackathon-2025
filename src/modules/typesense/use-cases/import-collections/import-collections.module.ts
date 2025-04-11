import { Module } from '@nestjs/common'
import { TypesenseClient } from '../../clients/typesense.client.js'
import { TypesenseCollectorFactory } from '../../services/collectors/typesense-collector.factory.js'
import { UserTypesenseCollectorModule } from '../../../../app/users/typesense/user-typesense-collector.module.js'
import { ContactTypesenseCollectorModule } from '../../../../app/contact/typesense/typesense-contact.module.js'
import { ImportCollectionsUseCase } from './import-collections.use-case.js'
import { ImportCollectionsController } from './import-collections.controller.js'

@Module({
  imports: [
    UserTypesenseCollectorModule,
    ContactTypesenseCollectorModule
  ],
  controllers: [ImportCollectionsController],
  providers: [
    ImportCollectionsUseCase,
    TypesenseClient,
    TypesenseCollectorFactory
  ]
})
export class ImportCollectionsModule {}
