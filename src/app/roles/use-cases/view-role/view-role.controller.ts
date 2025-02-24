import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiOkResponse } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { ViewRoleUseCase } from './view-role.use-case.js'
import { RoleResponse } from './view-role.response.js'

@ApiTags('Roles')
@Controller('roles/:role')
@ApiOAuth2([])
export class ViewRoleController {
  constructor (
    private readonly useCase: ViewRoleUseCase
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'The role has been successfully received.',
    type: RoleResponse
  })
  @Permissions(Permission.ROLE_READ)
  async getRole (
    @UuidParam('role') uuid: string
  ): Promise<RoleResponse> {
    return await this.useCase.execute(uuid)
  }
}
