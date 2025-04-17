import { OneOfMeta } from '@wisemen/one-of'
import { ApiProperty } from '@nestjs/swagger'
import { DomainEvent } from '../../../../modules/domain-events/domain-event.js'
import { Role } from '../../entities/role.entity.js'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { DomainEventLog } from '../../../../modules/domain-event-log/domain-event-log.entity.js'
import { DomainEventType } from '../../../../modules/domain-events/domain-event-type.js'
import { PermissionApiProperty } from '../../../../modules/permission/permission.api-property.js'
import { RegisterDomainEvent } from '../../../../modules/domain-events/register-domain-event.decorator.js'
import { RoleUuid } from '../../entities/role.uuid.js'

@OneOfMeta(DomainEventLog, DomainEventType.ROLE_PERMISSIONS_UPDATED)
export class RolePermissionsUpdatedEventContent {
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly roleUuid: RoleUuid

  @PermissionApiProperty({ isArray: true })
  readonly newPermissions: Permission[]

  @ApiProperty({ type: 'string' })
  readonly roleName: string

  constructor (role: Role) {
    this.roleUuid = role.uuid
    this.newPermissions = role.permissions
    this.roleName = role.name
  }
}

@RegisterDomainEvent(DomainEventType.ROLE_PERMISSIONS_UPDATED, 1)
export class RolePermissionsUpdatedEvent extends DomainEvent<RolePermissionsUpdatedEventContent> {
  constructor (role: Role) {
    super({
      content: new RolePermissionsUpdatedEventContent(role)
    })
  }
}
