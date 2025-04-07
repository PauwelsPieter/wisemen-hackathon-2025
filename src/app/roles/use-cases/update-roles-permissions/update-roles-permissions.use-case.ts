import assert from 'assert'
import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { transaction } from '@wisemen/nestjs-typeorm'
import { DomainEventEmitter } from '../../../../modules/domain-events/domain-event-emitter.js'
import { NotFoundCompositeApiError } from '../../../../modules/exceptions/api-errors/not-found-composite.api-error.js'
import { RoleNotEditableError } from '../../errors/role-not-editable.error.js'
import { TypesenseCollectionName } from '../../../../modules/typesense/enums/typesense-collection-index.enum.js'
import { TypesenseCollectionService } from '../../../../modules/typesense/services/typesense-collection.service.js'
import { RoleNotFoundError } from '../../errors/role-not-found.error.js'
import { UpdateRolesPermissionsRepository } from './update-roles-permissions.repository.js'
import { UpdateRolesPermissionsCommand } from './update-roles-permissions.command.js'
import { RolesPermissionsUpdatedEvent } from './roles-permissions-updated.event.js'

@Injectable()
export class UpdateRolesPermissionsUseCase {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private readonly repository: UpdateRolesPermissionsRepository,
    private readonly typesense: TypesenseCollectionService
  ) {}

  async updateRolePermissions (
    command: UpdateRolesPermissionsCommand
  ): Promise<void> {
    const roleUuids = command.roles.map(role => role.roleUuid)
    const roles = await this.repository.findRoles(roleUuids)

    const missingRoleUuids = roleUuids.filter((roleUuid) => {
      return !roles.some(role => role.uuid === roleUuid)
    })

    if (missingRoleUuids.length > 0) {
      const errors = missingRoleUuids.map(uuid => new RoleNotFoundError(uuid))

      throw new NotFoundCompositeApiError(errors)
    }

    const nonEditableRole = roles.find(role => role.isSystemAdmin)

    if (nonEditableRole !== undefined) {
      throw new RoleNotEditableError(nonEditableRole)
    }

    for (const role of roles) {
      const roleCommand = command.roles.find(c => c.roleUuid === role.uuid)

      assert(roleCommand !== undefined, 'Found role which should not exist')
      role.permissions = roleCommand.permissions
    }

    await transaction(this.dataSource, async () => {
      await this.repository.updateRoles(roles)
      await this.eventEmitter.emit(new RolesPermissionsUpdatedEvent(roles))

      // TODO: Remove this CBN-123
      await this.typesense.import(TypesenseCollectionName.USER)
    })
  }
}
