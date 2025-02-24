import { Module } from '@nestjs/common'
import { TypesenseClient } from '../../clients/typesense.client.js'
import { TypesenseCollectorFactory } from '../../services/collectors/typesense-collector.factory.js'
import { UserTypesenseCollector } from '../../services/collectors/user-typesense.collector.js'
import { UserRepository } from '../../../../app/users/repositories/user.repository.js'
import { ImportCollectionsUseCase } from './import-collections.use-case.js'
import { ImportCollectionsController } from './import-collections.controller.js'

@Module({
  controllers: [ImportCollectionsController],
  providers: [
    ImportCollectionsUseCase,
    TypesenseClient,
    TypesenseCollectorFactory,
    UserTypesenseCollector,
    UserRepository
  ]
})
export class ImportCollectionsModule {}
