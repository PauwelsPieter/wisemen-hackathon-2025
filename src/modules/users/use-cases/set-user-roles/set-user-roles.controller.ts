import { Body, Controller, Post } from '@nestjs/common'
import { ApiOAuth2, ApiTags } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { Permission } from '../../../permission/permission.enum.js'
import { Permissions } from '../../../permission/permission.decorator.js'
import { SetUserRolesUseCase } from './set-user-roles.use-case.js'
import { SetUserRolesCommand } from './set-user-roles.command.js'

@ApiTags('User')
@ApiOAuth2([])
@Controller('users/:user/role')
export class SetUserRolesController {
  constructor (
    private readonly useCase: SetUserRolesUseCase
  ) {}

  @Post()
  @Permissions(Permission.USER_UPDATE)
  async updateUser (
    @UuidParam('user') userUuid: string,
    @Body() dto: SetUserRolesCommand
  ): Promise<void> {
    await this.useCase.changeRoles(userUuid, dto)
  }
}
