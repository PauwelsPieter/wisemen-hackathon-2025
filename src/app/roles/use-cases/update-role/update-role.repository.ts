import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Not, Repository } from 'typeorm'
import { Role } from '../../entities/role.entity.js'

export class UpdateRoleRepository {
  constructor (
    @InjectRepository(Role) private roleRepository: Repository<Role>
  ) {}

  async findRole (withUuid: string): Promise<Role | null> {
    return await this.roleRepository.findOneBy({ uuid: withUuid })
  }

  async isNameAlreadyInUse (name: string, excludedRole: Role): Promise<boolean> {
    return await this.roleRepository.existsBy({ name, uuid: Not(excludedRole.uuid) })
  }

  async updateName (role: Role): Promise<void> {
    await this.roleRepository.update(
      { uuid: role.uuid },
      { name: role.name }
    )
  }
}
