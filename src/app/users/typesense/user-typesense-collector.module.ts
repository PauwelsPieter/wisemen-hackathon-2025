import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { User } from '../entities/user.entity.js'
import { UserTypesenseCollector } from './user-typesense.collector.js'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserTypesenseCollector],
  exports: [UserTypesenseCollector]
})
export class UserTypesenseCollectorModule {}
