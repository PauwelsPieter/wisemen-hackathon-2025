import { Module } from '@nestjs/common'
import { TypesenseUserModule } from '../../app/users/typesense/user-typesense.module.js'
import { TypesenseContactModule } from '../../app/contact/typesense/contact.typesense.module.js'
import { TypesenseQueryService } from './services/typesense-query.service.js'

import { TypesenseDocumentService } from './services/typesense-document.service.js'
import { TypesenseCollectionService } from './services/typesense-collection.service.js'
import { TypesenseClient } from './client/typesense.client.js'
import { MigrateCollectionsModule } from './use-cases/migrate-collections/migrate-collections.module.js'
import { ImportCollectionsModule } from './use-cases/import-collections/import-collections.module.js'
import { ViewCollectionsModule } from './use-cases/view-collections/view-collections.module.js'
import { TypesenseCollectionsModule } from './collections/typesense-collections.module.js'
import { TypesenseCollectorsModule } from './collectors/typesense-collectors.module.js'

@Module({
  imports: [
    TypesenseUserModule,
    TypesenseContactModule,

    MigrateCollectionsModule,
    ImportCollectionsModule,
    ViewCollectionsModule,
    TypesenseCollectionsModule,
    TypesenseCollectorsModule
  ],
  providers: [
    TypesenseClient,
    TypesenseQueryService,
    TypesenseDocumentService,
    TypesenseCollectionService
  ],
  exports: [
    TypesenseQueryService,
    TypesenseDocumentService,
    TypesenseCollectionService
  ]
})
export class TypesenseModule {}
