import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { TypesenseClient } from '../../clients/typesense.client.js'
import { TypesenseCollectorFactory } from '../../services/collectors/typesense-collector.factory.js'
import { UserTypesenseModule } from '../../../../app/users/typesense/user-typesense.module.js'
import { TypesenseSync } from '../../jobs/sync-typesense/typesense-sync.entity.js'
import { MigrateCollectionsUseCase } from './migrate-collections.use-case.js'
import { MigrateCollectionsController } from './migrate-collections.controller.js'

@Module({
  imports: [
    UserTypesenseModule,
    TypeOrmModule.forFeature([TypesenseSync])
  ],
  controllers: [MigrateCollectionsController],
  providers: [
    MigrateCollectionsUseCase,
    TypesenseClient,
    TypesenseCollectorFactory
  ]
})
export class MigrateCollectionsModule {}
