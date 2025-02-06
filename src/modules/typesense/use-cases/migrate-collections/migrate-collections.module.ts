import { Module } from '@nestjs/common'
import { TypesenseClient } from '../../clients/typesense.client.js'
import { TypesenseCollectorFactory } from '../../services/collectors/typesense-collector.factory.js'
import { UserTypesenseCollector } from '../../services/collectors/user-typesense.collector.js'
import { UserRepository } from '../../../users/repositories/user.repository.js'
import { MigrateCollectionsUseCase } from './migrate-collections.use-case.js'
import { MigrateCollectionsController } from './migrate-collections.controller.js'

@Module({
  controllers: [MigrateCollectionsController],
  providers: [
    MigrateCollectionsUseCase,
    TypesenseClient,
    TypesenseCollectorFactory,
    UserTypesenseCollector,
    UserRepository
  ]
})
export class MigrateCollectionsModule {}
