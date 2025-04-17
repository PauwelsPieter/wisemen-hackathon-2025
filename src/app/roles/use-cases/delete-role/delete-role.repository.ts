import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { Role } from '../../entities/role.entity.js'
import { UserRole } from '../../entities/user-role.entity.js'
import { RoleUuid } from '../../entities/role.uuid.js'

export class DeleteRoleRepository {
  constructor (
        @InjectRepository(Role) private roleRepository: Repository<Role>,
        @InjectRepository(UserRole) private userRoleRepository: Repository<UserRole>
  ) {}

  async findRole (withUuid: RoleUuid): Promise<Role | null> {
    return await this.roleRepository.findOneBy({ uuid: withUuid })
  }

  async delete (role: Role): Promise<void> {
    await this.userRoleRepository.delete({ roleUuid: role.uuid })
    await this.roleRepository.delete({ uuid: role.uuid })
  }
}
