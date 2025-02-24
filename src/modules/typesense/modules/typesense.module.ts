import { Module } from '@nestjs/common'
import { TypesenseQueryService } from '../services/typesense-query.service.js'
import { TypesenseInitializationService } from '../services/typesense-initialization.service.js'
import { TypesenseDocumentService } from '../services/typesense-document.service.js'
import { TypesenseCollectionService } from '../services/typesense-collection.service.js'
import { TypesenseCollectorFactory } from '../services/collectors/typesense-collector.factory.js'
import { UserTypesenseCollector } from '../services/collectors/user-typesense.collector.js'
import { UserRepository } from '../../../app/users/repositories/user.repository.js'
import { TypesenseClient } from '../clients/typesense.client.js'
import { MigrateCollectionsModule } from '../use-cases/migrate-collections/migrate-collections.module.js'
import { ImportCollectionsModule } from '../use-cases/import-collections/import-collections.module.js'
import { ViewCollectionsModule } from '../use-cases/view-collections/view-collections.module.js'

@Module({
  providers: [
    TypesenseClient,
    TypesenseQueryService,
    TypesenseDocumentService,
    TypesenseInitializationService,
    TypesenseCollectionService,
    TypesenseCollectorFactory,
    UserTypesenseCollector,
    UserRepository
  ],
  imports: [
    MigrateCollectionsModule,
    ImportCollectionsModule,
    ViewCollectionsModule
  ],
  exports: [
    TypesenseQueryService,
    TypesenseDocumentService,
    TypesenseInitializationService,
    TypesenseCollectionService,
    TypesenseCollectorFactory,
    UserTypesenseCollector
  ]
})
export class TypesenseModule {}
