import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { RoleNotEditableError } from '../../errors/role-not-editable.error.js'
import { UpdateRolesBulkCommand } from './update-roles-bulk.command.js'
import { UpdateRolesBulkUseCase } from './update-roles-bulk.use-case.js'

@ApiTags('Roles')
@Controller('roles/bulk')
@ApiOAuth2([])
export class UpdateRolesBulkController {
  constructor (
    private readonly useCase: UpdateRolesBulkUseCase
  ) {}

  @Post()
  @Permissions(Permission.ROLE_UPDATE)
  @ApiCreatedResponse()
  @ApiBadRequestResponse({ type: RoleNotEditableError })
  async updateRolesBulk (
    @Body() updateRolesBulkCommand: UpdateRolesBulkCommand
  ): Promise<void> {
    await this.useCase.execute(updateRolesBulkCommand)
  }
}
