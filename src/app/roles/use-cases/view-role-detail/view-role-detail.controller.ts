import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiOkResponse } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { RoleUuid } from '../../entities/role.uuid.js'
import { ViewRoleDetailUseCase } from './view-role-detail.use-case.js'
import { ViewRoleDetailResponse } from './view-role-detail.response.js'

@ApiTags('Role')
@Controller('roles/:role')
@ApiOAuth2([])
export class ViewRoleDetailController {
  constructor (
    private readonly useCase: ViewRoleDetailUseCase
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'The role has been successfully received.',
    type: ViewRoleDetailResponse
  })
  @Permissions(Permission.ROLE_READ)
  async getRole (
    @UuidParam('role') uuid: RoleUuid
  ): Promise<ViewRoleDetailResponse> {
    return await this.useCase.execute(uuid)
  }
}
