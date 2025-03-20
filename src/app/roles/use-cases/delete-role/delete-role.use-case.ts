import { Injectable } from '@nestjs/common'
import { InjectRepository, transaction } from '@wisemen/nestjs-typeorm'
import { DataSource, Repository } from 'typeorm'
import { Role } from '../../entities/role.entity.js'
import { RoleNotEditableError } from '../../errors/role-not-editable.error.js'
import { UserRole } from '../../entities/user-role.entity.js'
import { RoleCache } from '../../cache/role-cache.service.js'

@Injectable()
export class DeleteRoleUseCase {
  constructor (
    private readonly dataSource: DataSource,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    private readonly roleCache: RoleCache
  ) {}

  async execute (uuid: string): Promise<void> {
    const role = await this.roleRepository.findOneByOrFail({ uuid })

    if (role.isSystemAdmin) {
      throw new RoleNotEditableError(role)
    }

    await transaction(this.dataSource, async () => {
      await this.userRoleRepository.delete({ roleUuid: uuid })
      await this.roleRepository.delete({ uuid })
    })

    await this.roleCache.clearRolesPermissions([uuid])
  }
}
