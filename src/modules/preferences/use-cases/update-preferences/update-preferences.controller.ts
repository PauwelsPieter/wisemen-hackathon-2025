import { Body, Controller, ForbiddenException, Patch } from '@nestjs/common'
import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { AuthStorage } from '../../../auth/auth.storage.js'
import { UpdatePreferencesCommand } from './update-preferences.command.js'
import { UpdatePreferencesUseCase } from './update-preferences.use-case.js'

@ApiTags('Preferences')
@ApiOAuth2([])
@Controller('users/:userUuid/preferences')
export class UpdatePreferencesController {
  constructor (
    private readonly authStorage: AuthStorage,
    private readonly updatePreferencesUseCase: UpdatePreferencesUseCase
  ) { }

  @Patch()
  @ApiOkResponse()
  public async updatePreferences (
    @UuidParam('userUuid') userUuid: string,
    @Body() updatePreferencesCommand: UpdatePreferencesCommand
  ): Promise<void> {
    if (userUuid !== this.authStorage.getUserUuid()) {
      throw new ForbiddenException()
    }

    return this.updatePreferencesUseCase.execute(userUuid, updatePreferencesCommand)
  }
}
