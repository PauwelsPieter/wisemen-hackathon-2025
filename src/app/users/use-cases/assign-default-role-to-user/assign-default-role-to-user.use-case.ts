import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { transaction } from '@wisemen/nestjs-typeorm'
import { UserRoleEntityBuilder } from '../../../roles/tests/builders/entities/user-role-entity.builder.js'
import { DomainEventEmitter } from '../../../../modules/domain-events/domain-event-emitter.js'
import { UserRole } from '../../../roles/entities/user-role.entity.js'
import { AssignDefaultRoleToUserRepository } from './assign-default-role-to-user.repository.js'
import { RoleAssignedToUserEvent } from './role-assigned-to-user.event.js'

@Injectable()
export class AssignDefaultRoleToUserUseCase {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private readonly repository: AssignDefaultRoleToUserRepository
  ) {}

  async assignDefaultRole (toUserUuids: string[]): Promise<void> {
    if (toUserUuids.length === 0) {
      return
    }

    const defaultRole = await this.repository.getDefaultRole()

    const userRoles: UserRole[] = []
    const events: RoleAssignedToUserEvent[] = []
    for (const userUuid of toUserUuids) {
      const userRole = new UserRoleEntityBuilder()
        .withRoleUuid(defaultRole.uuid)
        .withUserUuid(userUuid)
        .build()

      userRoles.push(userRole)
      events.push(new RoleAssignedToUserEvent(userRole.userUuid, userRole.roleUuid))
    }

    await transaction(this.dataSource, async () => {
      await this.repository.insert(userRoles)
      await this.eventEmitter.emit(events)
    })
  }
}
