import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { Role } from '../../entities/role.entity.js'
import { ViewRoleIndexResponse } from './view-roles.response.js'

@Injectable()
export class ViewRolesUseCase {
  constructor (
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async execute (): Promise<ViewRoleIndexResponse> {
    const roles = await this.roleRepository.find()

    return new ViewRoleIndexResponse(roles)
  }
}
