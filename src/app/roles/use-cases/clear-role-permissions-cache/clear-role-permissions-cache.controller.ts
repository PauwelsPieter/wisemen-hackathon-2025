import { Controller, Post, Body, HttpCode } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiNoContentResponse } from '@nestjs/swagger'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { Permission } from '../../../../modules/permission/permission.enum.js'

import { ClearRolePermissionsCacheUseCase } from './clear-role-permissions-cache.use-case.js'
import { ClearRolePermissionsCacheCommand } from './clear-role-permissions-cache.command.js'

@ApiTags('Role')
@Controller('roles/clear-cache')
@ApiOAuth2([])
export class ClearRolePermissionsCacheController {
  constructor (
    private readonly useCase: ClearRolePermissionsCacheUseCase
  ) {}

  @Post()
  @HttpCode(204)
  @ApiNoContentResponse()
  @Permissions(Permission.ROLE_CACHE_CLEAR)
  async clearCache (
    @Body() command: ClearRolePermissionsCacheCommand
  ): Promise<void> {
    await this.useCase.execute(command.roleUuids ?? undefined)
  }
}
