import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { User } from '../../entities/user.entity.js'
import { DomainEventEmitterModule } from '../../../../modules/domain-events/domain-event-emitter.module.js'
import { GetOrCreateUserUseCase } from './get-or-create-user.use-case.js'
import { GetOrCreateUserRepository } from './get-or-create-user.repository.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    DomainEventEmitterModule
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
