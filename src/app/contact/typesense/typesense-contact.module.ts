import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { TypesenseSync } from '../../../modules/typesense/jobs/sync-typesense/typesense-sync.entity.js'
import { Contact } from '../entities/contact.entity.js'
import { ContactTypesenseCollector } from './contact.typesense-collector.js'

@Module({
  imports: [TypeOrmModule.forFeature([Contact, TypesenseSync])],
  providers: [ContactTypesenseCollector],
  exports: [ContactTypesenseCollector]
})
export class ContactTypesenseCollectorModule {}
