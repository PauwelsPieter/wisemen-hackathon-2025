import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiOkResponse } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { ViewRoleIndexResponse } from './view-roles.response.js'
import { ViewRolesUseCase } from './view-roles.use-case.js'

@ApiTags('Roles')
@Controller('roles')
@ApiOAuth2([])
export class ViewRolesController {
  constructor (
    private readonly useCase: ViewRolesUseCase
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'The roles has been successfully received.',
    type: ViewRoleIndexResponse
  })
  @Permissions(Permission.ROLE_READ)
  async getRoles (): Promise<ViewRoleIndexResponse> {
    return await this.useCase.execute()
  }
}
