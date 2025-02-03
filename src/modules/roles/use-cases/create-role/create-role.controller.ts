import { Controller, Post, Body } from '@nestjs/common'
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { CreateRoleCommand } from './create-role.command.js'
import { CreateRoleUseCase } from './create-role.use-case.js'

@ApiTags('Roles')
@Controller('roles')
@ApiOAuth2([])
export class CreateRoleController {
  constructor (
    private readonly useCase: CreateRoleUseCase
  ) {}

  @Post()
  @Permissions(Permission.ROLE_CREATE)
  async createRole (
    @Body() createRoleCommand: CreateRoleCommand
  ): Promise<void> {
    await this.useCase.execute(createRoleCommand)
  }
}
