import { OneOfMeta } from '@wisemen/one-of'
import { ApiProperty } from '@nestjs/swagger'
import { DomainEvent } from '../../../../modules/domain-events/domain-event.js'
import { Role } from '../../entities/role.entity.js'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { DomainEventLog } from '../../../../modules/domain-event-log/domain-event-log.entity.js'
import { DomainEventType } from '../../../../modules/domain-events/domain-event-type.js'
import { PermissionApiProperty } from '../../../../modules/permission/permission.api-property.js'
import { RegisterDomainEvent } from '../../../../modules/domain-events/register-domain-event.decorator.js'

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

@RegisterDomainEvent(DomainEventType.ROLES_PERMISSIONS_UPDATED, 1)
export class RolesPermissionsUpdatedEvent extends DomainEvent<RolePermissionsUpdatedEventContent> {
  constructor (roles: Role[]) {
    super({
      content: new RolePermissionsUpdatedEventContent(roles)
    })
  }
}
