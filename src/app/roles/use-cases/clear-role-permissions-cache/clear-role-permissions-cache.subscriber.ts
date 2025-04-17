import { Injectable } from '@nestjs/common'
import { Subscribe } from '../../../../modules/domain-events/subscribe.decorator.js'
import {
  RolePermissionsUpdatedEvent
} from '../update-roles-permissions/role-permissions-updated.event.js'
import { RoleDeletedEvent } from '../delete-role/role-deleted.event.js'
import { ClearRolePermissionsCacheUseCase } from './clear-role-permissions-cache.use-case.js'

@Injectable()
export class ClearRolePermissionsCacheSubscriber {
  constructor (
    private readonly useCase: ClearRolePermissionsCacheUseCase
  ) {}

  @Subscribe(RoleDeletedEvent)
  @Subscribe(RolePermissionsUpdatedEvent)
  async onEvents (events: Array<RoleDeletedEvent | RolePermissionsUpdatedEvent>): Promise<void> {
    const roleUuids = events.map(event => event.content.roleUuid)
    await this.useCase.execute(roleUuids)
  }
}
