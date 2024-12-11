import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { Role } from '../../entities/role.entity.js'
import { RoleResponse } from './view-role.response.js'

@Injectable()
export class ViewRoleUseCase {
  constructor (
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async execute (uuid: string): Promise<RoleResponse> {
    const role = await this.roleRepository.findOneByOrFail({ uuid })

    return new RoleResponse(role)
  }
}
