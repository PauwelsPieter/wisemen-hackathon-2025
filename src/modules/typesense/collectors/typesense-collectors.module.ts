import { Module } from '@nestjs/common'
import { ProvidersExplorerModule } from '../../../utils/providers/providers-explorer.module.js'
import { TypesenseCollectors } from './typesense-collectors.js'

@Module({
  imports: [ProvidersExplorerModule],
  providers: [TypesenseCollectors],
  exports: [TypesenseCollectors]
})
export class TypesenseCollectorsModule {}
