import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Any, Repository } from 'typeorm'
import { RedisClient } from '../../../modules/redis/redis.client.js'
import { Permission } from '../../../modules/permission/permission.enum.js'
import { Role } from '../entities/role.entity.js'
import { RoleUuid } from '../entities/role.uuid.js'

const ROLE_PERMISSIONS_CACHE = 'role-permissions-cache'

@Injectable()
export class RoleCache {
  constructor (
    private readonly client: RedisClient,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) { }

  async clearRolesPermissions (roleUuids: RoleUuid[]): Promise<void> {
    const keys = roleUuids.map(roleUuid => `${ROLE_PERMISSIONS_CACHE}.${roleUuid}`)

    await this.client.deleteCachedValues(keys)
  }

  async getRolesPermissions (roleUuids: RoleUuid[]): Promise<Permission[]> {
    if (roleUuids.length == 0) return []

    const permissions: Permission[] = []
    const missingRoleUuids: RoleUuid[] = []

    const cacheKeys = roleUuids.map(roleUuid => `${ROLE_PERMISSIONS_CACHE}.${roleUuid}`)
    const cachedEntries = await this.getCachedPermissions(cacheKeys)

    for (const [index, cachedPermissions] of cachedEntries.entries()) {
      if (cachedPermissions != null) {
        permissions.push(...cachedPermissions)
      } else {
        missingRoleUuids.push(roleUuids[index])
      }
    }

    if (missingRoleUuids.length > 0) {
      const missingPermissions = await this.getMissingPermissions(missingRoleUuids)

      permissions.push(...missingPermissions)
    }

    return permissions
  }

  private async getMissingPermissions (uuids: RoleUuid[]): Promise<Permission[]> {
    const roles = await this.roleRepository.findBy({ uuid: Any(uuids) })

    const newPermissions = roles.map(role => role.permissions)
    const newKeys = roles.map(role => `${ROLE_PERMISSIONS_CACHE}.${role.uuid}`)
    const values = newPermissions.map(permissions => JSON.stringify(permissions))

    await this.client.putCachedValues(newKeys, values)

    return roles.flatMap(role => role.permissions)
  }

  private async getCachedPermissions (keys: string[]): Promise<(Permission[] | null)[]> {
    const result = await this.client.getCachedValues(keys)

    return result.map((value) => {
      if (value != null) {
        return JSON.parse(String(value)) as Permission[]
      } else {
        return null
      }
    })
  }
}
