import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Role } from '../../entities/role.entity.js'
import { DomainEventEmitterModule } from '../../../../modules/domain-events/domain-event-emitter.module.js'
import { UpdateRoleController } from './update-role.controller.js'
import { UpdateRoleUseCase } from './update-role.use-case.js'
import { UpdateRoleRepository } from './update-role.repository.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    DomainEventEmitterModule
  ],
  controllers: [UpdateRoleController],
  providers: [UpdateRoleUseCase, UpdateRoleRepository]
})
export class UpdateRoleModule {}
