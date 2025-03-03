import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { transaction } from '@wisemen/nestjs-typeorm'
import { UserRoleEntityBuilder } from '../../../roles/tests/builders/entities/user-role-entity.builder.js'
import { EventEmitter } from '../../../../modules/events/event-emitter.js'
import { AssignDefaultRoleToUserRepository } from './assign-default-role-to-user.repository.js'
import { RoleAssignedToUserEvent } from './role-assigned-to-user.event.js'

@Injectable()
export class AssignDefaultRoleToUserUseCase {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter,
    private readonly repository: AssignDefaultRoleToUserRepository
  ) {}

  async assignDefaultRole (toUserUuid: string): Promise<void> {
    const defaultRole = await this.repository.getDefaultRole()
    const userRole = new UserRoleEntityBuilder()
      .withRoleUuid(defaultRole.uuid)
      .withUserUuid(toUserUuid)
      .build()

    const event = new RoleAssignedToUserEvent(userRole.userUuid, userRole.roleUuid)

    await transaction(this.dataSource, async () => {
      await this.repository.insert(userRole)
      await this.eventEmitter.emit(event)
    })
  }
}
