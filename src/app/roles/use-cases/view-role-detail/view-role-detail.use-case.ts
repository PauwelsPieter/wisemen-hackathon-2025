import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { Role } from '../../entities/role.entity.js'
import { RoleUuid } from '../../entities/role.uuid.js'
import { ViewRoleDetailResponse } from './view-role-detail.response.js'

@Injectable()
export class ViewRoleDetailUseCase {
  constructor (
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async execute (uuid: RoleUuid): Promise<ViewRoleDetailResponse> {
    const role = await this.roleRepository.findOneByOrFail({ uuid })

    return new ViewRoleDetailResponse(role)
  }
}
