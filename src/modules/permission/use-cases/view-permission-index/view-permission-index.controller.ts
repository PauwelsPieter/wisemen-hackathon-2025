import { Controller, Get } from '@nestjs/common'
import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../permission.enum.js'
import { Public } from '../../permission.decorator.js'
import { ViewPermissionIndexResponse } from './view-permission-index.response.js'

@ApiTags('Permissions')
@Controller('permissions')
@ApiOAuth2([])
export class ViewPermissionIndexController {
  @Get()
  @Public()
  @ApiOkResponse({ type: ViewPermissionIndexResponse })
  getPermissions (): ViewPermissionIndexResponse {
    return new ViewPermissionIndexResponse(Object.values(Permission))
  }
}
