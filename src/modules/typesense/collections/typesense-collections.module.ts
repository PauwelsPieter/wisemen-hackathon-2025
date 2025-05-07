import { Module } from '@nestjs/common'
import { ProvidersExplorerModule } from '../../../utils/providers/providers-explorer.module.js'
import { TypesenseCollections } from './typesense-collections.js'

@Module({
  imports: [ProvidersExplorerModule],
  providers: [TypesenseCollections],
  exports: [TypesenseCollections]
})
export class TypesenseCollectionsModule {}
