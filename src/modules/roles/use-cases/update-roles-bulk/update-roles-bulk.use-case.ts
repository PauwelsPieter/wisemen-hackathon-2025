import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { Role } from '../../entities/role.entity.js'
import { PermissionTransformer } from '../../../permission/transformers/permission.transformer.js'
import { TypesenseCollectionName } from '../../../typesense/enums/typesense-collection-index.enum.js'
import { TypesenseCollectionService } from '../../../typesense/services/typesense-collection.service.js'
import { RoleCache } from '../../cache/role-cache.service.js'
import { UpdateRoleTransformedType } from './update-roles-bulk-transformed.type.js'
import { UpdateRolesBulkCommand } from './update-roles-bulk.command.js'

@Injectable()
export class UpdateRolesBulkUseCase {
  constructor (
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private readonly typesenseCollectionService: TypesenseCollectionService,
    private readonly roleCache: RoleCache
  ) {}

  async execute (command: UpdateRolesBulkCommand): Promise<void> {
    const permissionTransformer = new PermissionTransformer()
    const roles: UpdateRoleTransformedType[] = command.roles.map(role => ({
      uuid: role.uuid,
      name: role.name,
      permissions: permissionTransformer.transformObjectToPermissions(role.permissions)
    }))

    await this.roleRepository.upsert(roles, { conflictPaths: { uuid: true } })

    await this.roleCache.clearRolesPermissions(command.roles.map(role => role.uuid))

    await this.typesenseCollectionService.import(TypesenseCollectionName.USER)
  }
}
