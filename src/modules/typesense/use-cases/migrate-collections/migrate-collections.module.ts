import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { TypesenseSync } from '../sync-collection/typesense-sync.entity.js'
import { TypesenseClientModule } from '../../client/typesense-client.module.js'
import { TypesenseCollectorsModule } from '../../collectors/typesense-collectors.module.js'
import { TypesenseCollectionsModule } from '../../collections/typesense-collections.module.js'
import { MigrateCollectionsUseCase } from './migrate-collections.use-case.js'
import { MigrateCollectionsController } from './migrate-collections.controller.js'

@Module({
  imports: [
    TypesenseCollectorsModule,
    TypesenseCollectionsModule,
    TypesenseClientModule,
    TypeOrmModule.forFeature([TypesenseSync])
  ],
  controllers: [MigrateCollectionsController],
  providers: [MigrateCollectionsUseCase],
  exports: [MigrateCollectionsUseCase]
})
export class MigrateCollectionsModule {}
