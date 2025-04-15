import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { Role } from '../../entities/role.entity.js'

@Injectable()
export class CreateRoleRepository {
  constructor (
    @InjectRepository(Role) private roleRepository: Repository<Role>
  ) {}

  async isNameAlreadyInUse (name: string): Promise<boolean> {
    return await this.roleRepository.existsBy({ name })
  }

  async insert (role: Role): Promise<void> {
    await this.roleRepository.insert(role)
  }
}
