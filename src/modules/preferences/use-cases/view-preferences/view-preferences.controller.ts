import { Controller, ForbiddenException, Get } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiOkResponse } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { Permission } from '../../../permission/permission.enum.js'
import { Permissions } from '../../../permission/permission.decorator.js'
import { AuthStorage } from '../../../auth/auth.storage.js'
import { ViewPreferencesResponse } from './view-preferences.response.js'
import { ViewPreferencesIndexUseCase } from './view-preferences.use-case.js'

@ApiTags('Preferences')
@ApiOAuth2([])
@Controller('users/:userUuid/preferences')
export class ViewPreferencesController {
  constructor (
    private readonly authStorage: AuthStorage,
    private readonly viewPreferencesIndexUseCase: ViewPreferencesIndexUseCase
  ) { }

  @Get()
  @Permissions(Permission.READ_ONLY)
  @ApiOkResponse({ type: ViewPreferencesResponse })
  public async viewPreferencesIndex (
    @UuidParam('userUuid') userUuid: string
  ): Promise<ViewPreferencesResponse> {
    if (userUuid !== this.authStorage.getUserUuid()) {
      throw new ForbiddenException()
    }

    return this.viewPreferencesIndexUseCase.execute(userUuid)
  }
}
