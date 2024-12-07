import { Module } from '@nestjs/common'
import { TypesenseModule } from '../../modules/typesense.module.js'
import { ImportTypesenseJobHandler } from './import-typesense.job.js'

@Module({
  imports: [
    TypesenseModule
  ],
  providers: [
    ImportTypesenseJobHandler
  ]
})
export class ImportTypesenseJobModule {}
