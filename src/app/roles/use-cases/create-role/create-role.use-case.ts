import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { Role } from '../../entities/role.entity.js'
import { RoleNameAlreadyInUseError } from '../../errors/role-name-already-in-use.error.js'
import { CreateRoleCommand } from './create-role.command.js'

@Injectable()
export class CreateRoleUseCase {
  constructor (
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async execute (command: CreateRoleCommand): Promise<void> {
    const role = await this.findByName(command.name)

    if (role != null) {
      throw new RoleNameAlreadyInUseError(command.name)
    }

    await this.roleRepository.insert(command)
  }

  private async findByName (name: string): Promise<Role | null> {
    return await this.roleRepository.findOneBy({ name })
  }
}
