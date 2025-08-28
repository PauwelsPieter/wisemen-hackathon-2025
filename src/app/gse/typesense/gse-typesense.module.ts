import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Gse } from '../entities/gse.entity.js'
import { GseTypesenseCollector } from './gse-typesense.collector.js'
import { GseTypesenseCollection } from './gse.collections.js'

@Module({
  imports: [TypeOrmModule.forFeature([Gse])],
  providers: [
    GseTypesenseCollector,
    GseTypesenseCollection
  ]
})
export class TypesenseGseModule {}
