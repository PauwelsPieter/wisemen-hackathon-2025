import { Injectable } from '@nestjs/common'
import { RoleCache } from '../../cache/role-cache.service.js'
import { Subscribe } from '../../../../modules/domain-events/subscribe.decorator.js'
import {
  RolesPermissionsUpdatedEvent
} from '../update-roles-permissions/roles-permissions-updated.event.js'

@Injectable()
export class ClearRolePermissionsCacheSubscriber {
  constructor (
    private readonly roleCache: RoleCache
  ) {}

  @Subscribe(RolesPermissionsUpdatedEvent)
  async onEvent (events: RolesPermissionsUpdatedEvent[]): Promise<void> {
    const roleUuids = events.flatMap(event => event.content.roles.map(role => role.uuid))

    await this.roleCache.clearRolesPermissions(roleUuids)
  }
}
