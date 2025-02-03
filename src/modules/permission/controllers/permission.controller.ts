import { Controller, Get } from '@nestjs/common'
import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Permission } from '../permission.enum.js'

@ApiTags('Permissions')
@Controller('permissions')
@ApiOAuth2([])
export class PermissionController {
  @Get()
  @ApiOkResponse({ type: String, isArray: true })
  getPermissions (): Permission[] {
    return Object.values(Permission)
  }
}
