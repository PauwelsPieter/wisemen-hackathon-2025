import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { Role } from '../../../roles/entities/role.entity.js'
import { UserRole } from '../../../roles/entities/user-role.entity.js'

export class AssignDefaultRoleToUserRepository {
  constructor (
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole) private readonly userRoleRepository: Repository<UserRole>
  ) {}

  async getDefaultRole (): Promise<Role> {
    return await this.roleRepository.findOneByOrFail({ isDefault: true })
  }

  async insert (userRole: UserRole): Promise<void> {
    await this.userRoleRepository.insert(userRole)
  }
}
