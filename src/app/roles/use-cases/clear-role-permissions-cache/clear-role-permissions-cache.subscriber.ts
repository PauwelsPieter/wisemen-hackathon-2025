import { Injectable } from '@nestjs/common'
import { RoleCache } from '../../cache/role-cache.service.js'
import { Subscribe } from '../../../../modules/events/subscribe.decorator.js'
import {
  RolesPermissionsUpdatedEvent
} from '../update-roles-permissions/roles-permissions-updated.event.js'

@Injectable()
export class ClearRolePermissionsCacheSubscriber {
  constructor (
    private readonly roleCache: RoleCache
  ) {}

  @Subscribe(RolesPermissionsUpdatedEvent)
  async onEvent (event: RolesPermissionsUpdatedEvent): Promise<void> {
    const roleUuids = event.content.roles.map(role => role.uuid)

    await this.roleCache.clearRolesPermissions(roleUuids)
  }
}
