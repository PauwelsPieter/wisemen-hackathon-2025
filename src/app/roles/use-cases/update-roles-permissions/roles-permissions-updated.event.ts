import { WiseEvent } from '../../../../modules/events/wise-event.js'
import { Role } from '../../entities/role.entity.js'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { API_EVENT_SOURCE } from '../../../../modules/events/constants.js'

class UpdatedRole {
  constructor (
    readonly uuid: string,
    readonly newPermissions: Permission[]
  ) {}
}

export class RolePermissionsUpdatedEventContent {
  readonly roles: UpdatedRole[]

  constructor (roles: Role[]) {
    this.roles = roles.map(role => new UpdatedRole(role.uuid, role.permissions))
  }
}

export class RolesPermissionsUpdatedEvent
  extends WiseEvent<RolePermissionsUpdatedEventContent> {
  static VERSION = 1
  static TYPE = 'roles.permissions.updated'

  constructor (roles: Role[]) {
    super({
      topic: RolesPermissionsUpdatedEvent.createTopic(),
      version: RolesPermissionsUpdatedEvent.VERSION,
      content: new RolePermissionsUpdatedEventContent(roles),
      type: RolesPermissionsUpdatedEvent.TYPE,
      source: API_EVENT_SOURCE
    })
  }

  private static createTopic (): string {
    return `roles.permissions.updated`
  }
}
