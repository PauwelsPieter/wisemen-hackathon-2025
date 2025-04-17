import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Any, Repository } from 'typeorm'
import { Role } from '../../entities/role.entity.js'
import { RoleUuid } from '../../entities/role.uuid.js'

@Injectable()
export class UpdateRolesPermissionsRepository {
  constructor (
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>
  ) {}

  async findRoles (uuids: RoleUuid[]): Promise<Role[]> {
    return await this.roleRepository.findBy({ uuid: Any(uuids) })
  }

  async updateRoles (roles: Role[]): Promise<void> {
    await this.roleRepository.upsert(roles, { conflictPaths: { uuid: true } })
  }
}
