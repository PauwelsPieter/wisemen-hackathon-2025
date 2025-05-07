import { Module } from '@nestjs/common'
import { UserTypesenseRepository } from '../../repositories/user-typesense.repository.js'
import { TypesenseModule } from '../../../../modules/typesense/typesense.module.js'
import { ViewUsersController } from './view-users.controller.js'
import { ViewUsersUseCase } from './view-users.use-case.js'

@Module({
  imports: [
    TypesenseModule
  ],
  controllers: [ViewUsersController],
  providers: [ViewUsersUseCase, UserTypesenseRepository]
})
export class ViewUsersModule {}
