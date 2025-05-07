import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Contact } from '../entities/contact.entity.js'
import { ContactTypesenseCollector } from './contact.typesense-collector.js'
import { ContactTypesenseCollection } from './contact.typesense-collection.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact])
  ],
  providers: [
    ContactTypesenseCollector,
    ContactTypesenseCollection
  ]
})
export class TypesenseContactModule {}
