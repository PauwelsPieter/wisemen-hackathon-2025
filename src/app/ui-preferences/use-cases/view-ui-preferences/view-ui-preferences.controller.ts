import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiOkResponse } from '@nestjs/swagger'
import { ViewUiPreferencesResponse } from './view-ui-preferences.response.js'
import { ViewUiPreferencesIndexUseCase } from './view-ui-preferences.use-case.js'

@ApiTags('Preferences')
@ApiOAuth2([])
@Controller('me/ui-preferences')
export class ViewUiPreferencesController {
  constructor (
    private readonly viewPreferencesIndexUseCase: ViewUiPreferencesIndexUseCase
  ) {}

  @Get()
  @ApiOkResponse({ type: ViewUiPreferencesResponse })
  public async viewPreferencesIndex (): Promise<ViewUiPreferencesResponse> {
    return this.viewPreferencesIndexUseCase.execute()
  }
}
