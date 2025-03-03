import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { User } from '../../entities/user.entity.js'
import { EventModule } from '../../../../modules/events/event.module.js'
import { GetOrCreateUserUseCase } from './get-or-create-user.use-case.js'
import { GetOrCreateUserRepository } from './get-or-create-user.repository.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EventModule
  ],
  providers: [
    GetOrCreateUserUseCase,
    GetOrCreateUserRepository
  ],
  exports: [
    GetOrCreateUserUseCase
  ]
})
export class GetOrCreateUserModule {}
