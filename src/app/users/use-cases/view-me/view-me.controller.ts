import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get } from '@nestjs/common'
import { AuthContext } from '../../../../modules/auth/auth.context.js'
import { ViewMeUseCase } from './view-me.use-case.js'
import { ViewMeResponse } from './view-me.response.js'

@ApiTags('User')
@ApiOAuth2([])
@Controller('users/me')
export class ViewMeController {
  constructor (
    private readonly useCase: ViewMeUseCase,
    private readonly authContext: AuthContext
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'User details retrieved',
    type: ViewMeResponse
  })
  async viewMe (): Promise<ViewMeResponse> {
    const userUuid = this.authContext.getUserUuidOrFail()
    const user = await this.useCase.viewMe(userUuid)

    return new ViewMeResponse(user)
  }
}
