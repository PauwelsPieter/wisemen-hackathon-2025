import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiResponse } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { ViewContactIndexResponse } from './view-roles.response.js'
import { ViewRolesUseCase } from './view-roles.use-case.js'

@ApiTags('Roles')
@Controller('roles')
@ApiOAuth2([])
export class ViewRolesController {
  constructor (
    private readonly useCase: ViewRolesUseCase
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The roles has been successfully received.',
    type: ViewContactIndexResponse
  })
  @Permissions(Permission.ROLE_READ)
  async getRoles (): Promise<ViewContactIndexResponse> {
    return await this.useCase.execute()
  }
}
