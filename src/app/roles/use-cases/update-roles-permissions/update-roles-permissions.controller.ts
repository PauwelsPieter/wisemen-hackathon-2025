import { Body, Controller, HttpCode, HttpStatus, Patch } from '@nestjs/common'
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger'
import { RoleNotFoundError } from '../../errors/role-not-found.error.js'
import { ApiNotFoundErrorResponse } from '../../../../modules/exceptions/api-errors/api-error-response.decorator.js'
import { UpdateRolesPermissionsUseCase } from './update-roles-permissions.use-case.js'
import { UpdateRolesPermissionsCommand } from './update-roles-permissions.command.js'

@ApiTags('Role')
@Controller('/roles')
export class UpdateRolesPermissionsController {
  constructor (
    private readonly useCase: UpdateRolesPermissionsUseCase
  ) {}

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundErrorResponse(RoleNotFoundError)
  async updateRolePermissions (
    @Body() command: UpdateRolesPermissionsCommand
  ): Promise<void> {
    await this.useCase.updateRolePermissions(command)
  }
}
