import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { TypesenseModule } from '../../typesense.module.js'
import { SyncTypesenseHandler } from './sync-typesense-collection.handler.js'
import { TypesenseSyncRepository } from './typesense-sync.repository.js'
import { TypesenseSync } from './typesense-sync.entity.js'

@Module({
  imports: [
    TypesenseModule,
    TypeOrmModule.forFeature([TypesenseSync])
  ],
  providers: [
    SyncTypesenseHandler,
    TypesenseSyncRepository
  ]
})
export class SyncTypesenseJobModule {}
