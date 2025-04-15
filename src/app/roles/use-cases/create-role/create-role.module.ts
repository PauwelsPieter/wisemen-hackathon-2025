import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Role } from '../../entities/role.entity.js'
import { DomainEventEmitterModule } from '../../../../modules/domain-events/domain-event-emitter.module.js'
import { CreateRoleUseCase } from './create-role.use-case.js'
import { CreateRoleController } from './create-role.controller.js'
import { CreateRoleRepository } from './create-role.repository.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    DomainEventEmitterModule
  ],
  controllers: [CreateRoleController],
  providers: [
    CreateRoleUseCase,
    CreateRoleRepository
  ]
})
export class CreateRoleModule {}
