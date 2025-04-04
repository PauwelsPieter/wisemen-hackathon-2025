import { Body, Controller, Patch } from '@nestjs/common'
import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { UpdateUiPreferencesCommand } from './update-ui-preferences.command.js'
import { UpdateUiPreferencesUseCase } from './update-ui-preferences.use-case.js'

@ApiTags('Preferences')
@ApiOAuth2([])
@Controller('/me/ui-preferences')
export class UpdateUiPreferencesController {
  constructor (
    private readonly updatePreferencesUseCase: UpdateUiPreferencesUseCase
  ) {}

  @Patch()
  @ApiOkResponse()
  public async updatePreferences (
    @Body() updatePreferencesCommand: UpdateUiPreferencesCommand
  ): Promise<void> {
    return this.updatePreferencesUseCase.execute(updatePreferencesCommand)
  }
}
