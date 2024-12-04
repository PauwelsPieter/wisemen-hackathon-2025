import { Body, Controller, Post } from '@nestjs/common'
import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { Permission } from '../../../permission/permission.enum.js'
import { Permissions } from '../../../permission/permission.decorator.js'
import { ChangeUserRoleUseCase } from './change-user-roles.use-case.js'
import { ChangeUserRoleCommand } from './change-user-roles.command.js'

@ApiTags('User')
@ApiOAuth2([])
@Controller('users/:user/role')
export class ChangeUserRoleController {
  constructor (
    private readonly useCase: ChangeUserRoleUseCase
  ) {}

  @Post()
  @Permissions(Permission.ADMIN)
  @ApiOkResponse({ description: 'The user\'s role has been successfully changed.' })
  async updateUser (
    @UuidParam('user') userUuid: string,
    @Body() dto: ChangeUserRoleCommand
  ): Promise<void> {
    await this.useCase.changeRoles(userUuid, dto)
  }
}
