import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { InjectRepository, transaction } from '@wisemen/nestjs-typeorm'
import { RoleCache } from '../../cache/role-cache.service.js'
import { Role } from '../../entities/role.entity.js'
import { DomainEventEmitter } from '../../../../modules/domain-events/domain-event-emitter.js'
import { RolePermissionsCacheClearedEvent } from './role-permissions-cache-cleared.event.js'

@Injectable()
export class ClearRolePermissionsCacheUseCase {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private readonly roleCache: RoleCache,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>
  ) {}

  async execute (roleUuids?: string[]): Promise<void> {
    if (roleUuids === undefined) {
      const roles = await this.roleRepository.find({ select: { uuid: true } })
      roleUuids = roles.map(role => role.uuid)
    }

    await this.roleCache.clearRolesPermissions(roleUuids)

    await transaction(this.dataSource, async () => {
      await this.eventEmitter.emitOne(new RolePermissionsCacheClearedEvent(roleUuids))
    })
  }
}
