import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Role } from '../../../roles/entities/role.entity.js'
import { UserRole } from '../../../roles/entities/user-role.entity.js'
import { EventModule } from '../../../../modules/events/event.module.js'
import { AssignDefaultRoleToUserRepository } from './assign-default-role-to-user.repository.js'
import { AssignDefaultRoleToUserUseCase } from './assign-default-role-to-user.use-case.js'
import { AssignDefaultRoleToUserSubscriber } from './assign-default-role-to-user.subscriber.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, UserRole]),
    EventModule
  ],
  providers: [
    AssignDefaultRoleToUserRepository,
    AssignDefaultRoleToUserUseCase,
    AssignDefaultRoleToUserSubscriber
  ]
})
export class AssignDefaultRoleToUserModule {}
