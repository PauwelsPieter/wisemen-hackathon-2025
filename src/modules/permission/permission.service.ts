import { Injectable } from '@nestjs/common'
import { UserCache } from '../../app/users/cache/user-cache.js'
import { RoleCache } from '../../app/roles/cache/role-cache.service.js'
import { UserUuid } from '../../app/users/entities/user.uuid.js'
import { Permission } from './permission.enum.js'

@Injectable()
export class PermissionService {
  constructor (
    private readonly userCache: UserCache,
    private readonly roleCache: RoleCache
  ) {}

  private async getUserPermissions (userUuid: UserUuid): Promise<Permission[]> {
    const roleUuids = await this.userCache.getUserRoles(userUuid)

    return await this.roleCache.getRolesPermissions(roleUuids)
  }

  public async hasPermissions (userUuid: UserUuid, permissions: Permission[]): Promise<boolean> {
    if (permissions.length === 0) {
      return true
    }

    const userPermissions = await this.getUserPermissions(userUuid)

    const hasAllPermission = userPermissions.includes(Permission.ALL_PERMISSIONS)

    if (hasAllPermission) {
      return true
    }

    return permissions.some(permission => userPermissions.includes(permission))
  }
}
