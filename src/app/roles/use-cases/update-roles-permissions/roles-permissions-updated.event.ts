import { OneOfMeta } from '@wisemen/one-of'
import { ApiProperty } from '@nestjs/swagger'
import { DomainEvent } from '../../../../modules/domain-events/domain-event.js'
import { Role } from '../../entities/role.entity.js'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { DomainEventLog } from '../../../../modules/domain-event-log/domain-event-log.entity.js'
import { DomainEventType } from '../../../../modules/domain-events/domain-event-type.js'
import { PermissionApiProperty } from '../../../../modules/permission/permission.api-property.js'

class UpdatedRole {
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly uuid: string

  @PermissionApiProperty({ isArray: true })
  readonly newPermissions: Permission[]

  constructor (uuid: string, newPermissions: Permission[]) {
    this.newPermissions = newPermissions
    this.uuid = uuid
  }
}

@OneOfMeta(DomainEventLog, DomainEventType.ROLES_PERMISSIONS_UPDATED)
export class RolePermissionsUpdatedEventContent {
  @ApiProperty({ type: UpdatedRole, isArray: true })
  readonly roles: UpdatedRole[]

  constructor (roles: Role[]) {
    this.roles = roles.map(role => new UpdatedRole(role.uuid, role.permissions))
  }
}

export class RolesPermissionsUpdatedEvent extends DomainEvent<RolePermissionsUpdatedEventContent> {
  static VERSION = 1
  static TYPE = DomainEventType.ROLES_PERMISSIONS_UPDATED

  constructor (roles: Role[]) {
    super({
      topic: RolesPermissionsUpdatedEvent.createTopic(),
      version: RolesPermissionsUpdatedEvent.VERSION,
      content: new RolePermissionsUpdatedEventContent(roles),
      type: RolesPermissionsUpdatedEvent.TYPE
    })
  }

  private static createTopic (): string {
    return `roles.permissions.updated`
  }
}
