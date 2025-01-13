import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { RedisClient } from '../../redis/redis.client.js'
import { Permission } from '../../permission/permission.enum.js'
import { Role } from '../entities/role.entity.js'

const rolePermissionsCache = `role-permissions-cache`

@Injectable()
export class RoleCache {
  constructor (
    private readonly client: RedisClient,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
    // private readonly userRepository: UserRepository
  ) {}

  async clearRolesPermissions (roleUuids: string[]): Promise<void> {
    for (const roleUuid of roleUuids) {
      await this.client.deleteCachedValue(`${rolePermissionsCache}.${roleUuid}`)
    }
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
}
