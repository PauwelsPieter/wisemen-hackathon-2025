import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiNoContentResponse } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { RoleUuid } from '../../entities/role.uuid.js'
import { ApiNotFoundErrorResponse } from '../../../../modules/exceptions/api-errors/api-error-response.decorator.js'
import { RoleNotFoundError } from '../../errors/role-not-found.error.js'
import { UpdateRoleUseCase } from './update-role.use-case.js'
import { UpdateRoleCommand } from './update-role.command.js'

@ApiTags('Role')
@Controller('roles/:role')
@ApiOAuth2([])
export class UpdateRoleController {
  constructor (
    private readonly useCase: UpdateRoleUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(Permission.ROLE_UPDATE)
  @ApiNotFoundErrorResponse(RoleNotFoundError)
  @ApiNoContentResponse()
  async updateRole (
    @Body() updateRoleCommand: UpdateRoleCommand,
    @UuidParam('role') uuid: RoleUuid
  ): Promise<void> {
    await this.useCase.execute(uuid, updateRoleCommand)
  }
}
