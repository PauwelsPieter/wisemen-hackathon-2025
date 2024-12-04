import { Injectable } from '@nestjs/common'
import { RoleRepository } from '../roles/repositories/role.repository.js'
import { UserRepository } from '../users/repositories/user.repository.js'
import { Permission } from '../permission/permission.enum.js'
import { RedisClient } from '../redis/redis.client.js'

const rolePermissionsCache = `role-permissions-cache`
const userRoleCache = `user-role-cache`

@Injectable()
export class CacheService {
  constructor (
    // private readonly client: NatsClient,
    private readonly client: RedisClient,
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository
  ) {

  }

  async getRolesPermissions (roleUuids: string[]): Promise<Permission[]> {
    if (roleUuids.length == 0) return [Permission.READ_ONLY]

    const permissions: Permission[] = []

    for (const roleUuid of roleUuids) {
      const result = await this.client.getCachedValue(`${rolePermissionsCache}.${roleUuid}`)

      if (result != null) {
        const test = JSON.parse(String(result)) as Permission[]

        permissions.push(...test)

        continue
      }

      const role = await this.roleRepository.findOneBy({ uuid: roleUuid })
      const rolePermissions = role?.permissions ?? []

      permissions.push(...rolePermissions)

      await this.client.putCachedValue(`${rolePermissionsCache}.${roleUuid}`, JSON.stringify(rolePermissions))
    }

    return permissions
  }

  async clearRolesPermissions (roleUuids: string[]): Promise<void> {
    for (const roleUuid of roleUuids) {
      await this.client.deleteCachedValue(`${rolePermissionsCache}.${roleUuid}`)
    }
  }

  async getUserRoles (userUuid: string): Promise<string[]> {
    const result = await this.client.getCachedValue(`${userRoleCache}.${userUuid}`)

    if (result != null) {
      return JSON.parse(String(result)) as string[]
    }

    const user = await this.userRepository.findOne({
      where: { uuid: userUuid },
      relations: { userRoles: true }
    })

    const roleUuids = user?.userRoles?.map(userRole => userRole.roleUuid) ?? []

    await this.client.putCachedValue(`${userRoleCache}.${userUuid}`, JSON.stringify(roleUuids))

    return roleUuids
  }

  async setUserRoles (userUuid: string, roleUuids: string[]): Promise<void> {
    await this.client.putCachedValue(`${userRoleCache}.${userUuid}`, JSON.stringify(roleUuids))
  }

  async clearUserRole (userUuid: string): Promise<void> {
    await this.client.deleteCachedValue(`${userRoleCache}.${userUuid}`)
  }

  async getUserPermissions (userUuid: string): Promise<Permission[]> {
    const roleUuids = await this.getUserRoles(userUuid)

    return await this.getRolesPermissions(roleUuids)
  }

  hasAdminPermission (userPermissions: Permission[]): boolean {
    return userPermissions.includes(Permission.ADMIN)
  }

  async hasPermissions (userUuid: string, permissions: Permission[]): Promise<boolean> {
    if (permissions.length === 0) {
      return true
    }

    const userPermissions = await this.getUserPermissions(userUuid)

    const hasAdminPermission = this.hasAdminPermission(userPermissions)

    if (hasAdminPermission) {
      return true
    }

    return permissions.some(permission => userPermissions.includes(permission))
  }
}
