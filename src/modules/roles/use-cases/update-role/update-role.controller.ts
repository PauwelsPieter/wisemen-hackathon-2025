import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { UpdateRoleUseCase } from './update-role.use-case.js'
import { UpdateRoleCommand } from './update-role.command.js'

@ApiTags('Roles')
@Controller('roles/:role')
@ApiOAuth2([])
export class UpdateRoleController {
  constructor (
    private readonly useCase: UpdateRoleUseCase
  ) {}

  @Post()
  @Permissions(Permission.ROLE_UPDATE)
  async updateRole (
    @Body() updateRoleCommand: UpdateRoleCommand,
    @UuidParam('role') uuid: string
  ): Promise<void> {
    await this.useCase.execute(uuid, updateRoleCommand)
  }
}
