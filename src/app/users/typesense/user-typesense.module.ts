import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { User } from '../entities/user.entity.js'
import { UserTypesenseCollector } from './user-typesense.collector.js'
import { UserTypesenseCollection } from './user.collections.js'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserTypesenseCollector,
    UserTypesenseCollection
  ]
})
export class TypesenseUserModule {}
