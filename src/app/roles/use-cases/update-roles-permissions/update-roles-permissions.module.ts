import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { DomainEventEmitterModule } from '../../../../modules/domain-events/domain-event-emitter.module.js'
import { Role } from '../../entities/role.entity.js'
import { TypesenseModule } from '../../../../modules/typesense/modules/typesense.module.js'
import { UpdateRolesPermissionsController } from './update-roles-permissions.controller.js'
import { UpdateRolesPermissionsUseCase } from './update-roles-permissions.use-case.js'
import { UpdateRolesPermissionsRepository } from './update-roles-permissions.repository.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    DomainEventEmitterModule,
    TypesenseModule
  ],
  controllers: [UpdateRolesPermissionsController],
  providers: [
    UpdateRolesPermissionsUseCase,
    UpdateRolesPermissionsRepository
  ]
})
export class UpdateRolesPermissionsModule {}
