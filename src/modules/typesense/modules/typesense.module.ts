import { Module } from '@nestjs/common'
import { TypesenseQueryService } from '../services/typesense-query.service.js'
import { TypesenseInitializationService } from '../services/typesense-initialization.service.js'
import { TypesenseDocumentService } from '../services/typesense-document.service.js'
import { TypesenseCollectionService } from '../services/typesense-collection.service.js'
import { TypesenseCollectorFactory } from '../services/collectors/typesense-collector.factory.js'
import { TypesenseClient } from '../clients/typesense.client.js'
import { MigrateCollectionsModule } from '../use-cases/migrate-collections/migrate-collections.module.js'
import { ImportCollectionsModule } from '../use-cases/import-collections/import-collections.module.js'
import { ViewCollectionsModule } from '../use-cases/view-collections/view-collections.module.js'
import { UserTypesenseCollectorModule } from '../../../app/users/typesense/user-typesense-collector.module.js'

@Module({
  providers: [
    TypesenseClient,
    TypesenseQueryService,
    TypesenseDocumentService,
    TypesenseInitializationService,
    TypesenseCollectionService,
    TypesenseCollectorFactory
  ],
  imports: [
    MigrateCollectionsModule,
    ImportCollectionsModule,
    ViewCollectionsModule,
    UserTypesenseCollectorModule
  ],
  exports: [
    TypesenseQueryService,
    TypesenseDocumentService,
    TypesenseInitializationService,
    TypesenseCollectionService,
    TypesenseCollectorFactory
  ]
})
export class TypesenseModule {}
