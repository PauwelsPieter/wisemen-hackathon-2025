import { OneOfMeta } from '@wisemen/one-of'
import { ApiProperty } from '@nestjs/swagger'
import { WiseEvent } from '../../../../modules/events/wise-event.js'
import { Role } from '../../entities/role.entity.js'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { EventLog } from '../../../../modules/event-log/event-log.entity.js'
import { EventType } from '../../../../modules/events/event-type.js'
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

@OneOfMeta(EventLog, EventType.ROLES_PERMISSIONS_UPDATED)
export class RolePermissionsUpdatedEventContent {
  @ApiProperty({ type: UpdatedRole, isArray: true })
  readonly roles: UpdatedRole[]

  constructor (roles: Role[]) {
    this.roles = roles.map(role => new UpdatedRole(role.uuid, role.permissions))
  }
}

export class RolesPermissionsUpdatedEvent extends WiseEvent<RolePermissionsUpdatedEventContent> {
  static VERSION = 1
  static TYPE = EventType.ROLES_PERMISSIONS_UPDATED

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
