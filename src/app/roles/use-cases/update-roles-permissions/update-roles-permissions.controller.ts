import { Body, Controller, HttpCode, HttpStatus, Patch } from '@nestjs/common'
import { ApiNoContentResponse, ApiOAuth2, ApiTags } from '@nestjs/swagger'
import { RoleNotFoundError } from '../../errors/role-not-found.error.js'
import { ApiNotFoundErrorResponse } from '../../../../modules/exceptions/api-errors/api-error-response.decorator.js'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { UpdateRolesPermissionsUseCase } from './update-roles-permissions.use-case.js'
import { UpdateRolesPermissionsCommand } from './update-roles-permissions.command.js'

@ApiTags('Role')
@ApiOAuth2([])
@Controller('/roles')
export class UpdateRolesPermissionsController {
  constructor (
    private readonly useCase: UpdateRolesPermissionsUseCase
  ) {}

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(Permission.ROLE_UPDATE)
  @ApiNoContentResponse()
  @ApiNotFoundErrorResponse(RoleNotFoundError)
  async updateRolePermissions (
    @Body() command: UpdateRolesPermissionsCommand
  ): Promise<void> {
    await this.useCase.updateRolePermissions(command)
  }
}
