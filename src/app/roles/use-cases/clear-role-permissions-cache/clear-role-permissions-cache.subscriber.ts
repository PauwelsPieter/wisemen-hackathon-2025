import { Injectable } from '@nestjs/common'
import { RoleCache } from '../../cache/role-cache.service.js'
import { Subscribe } from '../../../../modules/domain-events/subscribe.decorator.js'
import {
  RolePermissionsUpdatedEvent
} from '../update-roles-permissions/role-permissions-updated.event.js'
import { RoleDeletedEvent } from '../delete-role/role-deleted.event.js'

@Injectable()
export class ClearRolePermissionsCacheSubscriber {
  constructor (
    private readonly roleCache: RoleCache
  ) {}

  @Subscribe(RoleDeletedEvent)
  @Subscribe(RolePermissionsUpdatedEvent)
  async onEvents (events: Array<RoleDeletedEvent | RolePermissionsUpdatedEvent>): Promise<void> {
    const roleUuids = events.map(event => event.content.roleUuid)
    await this.roleCache.clearRolesPermissions(roleUuids)
  }
}
