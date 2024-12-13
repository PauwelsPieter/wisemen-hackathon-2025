import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { Role } from '../../entities/role.entity.js'
import { RoleNameAlreadyInUseError } from '../../errors/role-name-already-in-use.error.js'
import { UpdateRoleCommand } from './update-role.command.js'

@Injectable()
export class UpdateRoleUseCase {
  constructor (
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async execute (uuid: string, command: UpdateRoleCommand): Promise<void> {
    const exists = await this.findByName(command.name)

    if (exists != null) {
      throw new RoleNameAlreadyInUseError(command.name)
    }

    await this.roleRepository.update(uuid, command)
  }

  private async findByName (name: string): Promise<Role | null> {
    return await this.roleRepository.findOneBy({ name })
  }
}
