import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
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
  async updateRolesBulk (
    @Body() updateRolesBulkCommand: UpdateRolesBulkCommand
  ): Promise<void> {
    await this.useCase.execute(updateRolesBulkCommand)
  }
}
