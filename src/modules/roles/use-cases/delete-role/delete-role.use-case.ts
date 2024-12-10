import { Injectable } from '@nestjs/common'
import { InjectRepository, transaction } from '@wisemen/nestjs-typeorm'
import { DataSource, Repository } from 'typeorm'
import { Role } from '../../entities/role.entity.js'
import { RoleNotEditableError } from '../../errors/role-not-editable.error.js'
import { UserRole } from '../../entities/user-role.entity.js'
import { CacheService } from '../../../cache/cache.service.js'

@Injectable()
export class DeleteRoleUseCase {
  constructor (
    private readonly dataSource: DataSource,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    private readonly cache: CacheService
  ) {}

  async execute (uuid: string): Promise<void> {
    const role = await this.roleRepository.findOneByOrFail({ uuid })

    if (role.name === 'admin' || role.name === 'readonly') {
      throw new RoleNotEditableError()
    }

    await transaction(this.dataSource, async () => {
      await this.userRoleRepository.delete({
        roleUuid: uuid
      })

      await this.roleRepository.remove(role)
    })

    await this.cache.clearRolesPermissions([uuid])
  }
}
