import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Any, Repository } from 'typeorm'
import { RedisClient } from '../../redis/redis.client.js'
import { Permission } from '../../permission/permission.enum.js'
import { Role } from '../entities/role.entity.js'

const ROLE_PERMISSIONS_CACHE = 'role-permissions-cache'

@Injectable()
export class RoleCache {
  constructor (
    private readonly client: RedisClient,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) { }

  async clearRolesPermissions (roleUuids: string[]): Promise<void> {
    const keys = roleUuids.map(roleUuid => `${ROLE_PERMISSIONS_CACHE}.${roleUuid}`)

    await this.client.deleteCachedValues(keys)
  }

  async getRolesPermissions (roleUuids: string[]): Promise<Permission[]> {
    if (roleUuids.length == 0) return [Permission.READ_ONLY]

    const permissions: Permission[] = []
    const missingRoleUuids: string[] = []

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

  private async getMissingPermissions (uuids: string[]): Promise<Permission[]> {
    const roles = await this.roleRepository.findBy({
      uuid: Any(uuids)
    })

    const newPermissions = roles.map(role => role.permissions)
    const newKeys = roles.map(role => `${ROLE_PERMISSIONS_CACHE}.${role.uuid}`)

    await this.setCachedPermissions(newKeys, newPermissions)

    return roles.flatMap(role => role.permissions)
  }

  private async getCachedPermissions (keys: string[]): Promise<(Permission[] | null)[]> {
    try {
      const result = await this.client.getCachedValues(keys)

      return result.map((value) => {
        if (value != null) {
          return JSON.parse(String(value)) as Permission[]
        } else {
          return null
        }
      })
    } catch {
      return new Array<(Permission[] | null)>(keys.length).fill(null)
    }
  }

  private async setCachedPermissions (keys: string[], permissions: Permission[][]): Promise<void> {
    const values = permissions.map(permissions => JSON.stringify(permissions))

    try {
      await this.client.putCachedValues(keys, values)
    } catch { /* empty */ }
  }
}
