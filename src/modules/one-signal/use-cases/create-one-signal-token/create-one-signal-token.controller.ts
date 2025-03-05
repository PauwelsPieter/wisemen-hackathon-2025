import { Controller, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { CreateOneSignalTokenUseCase } from './create-one-signal-token.use-case.js'
import { CreateOneSignalTokenResponse } from './create-one-signal-token.response.js'

@Controller()
@ApiTags('OneSignal')
export class CreateOneSignalTokenController {
  constructor (private readonly createTokenUseCase: CreateOneSignalTokenUseCase) {}

  @Post('onesignal/token')
  @ApiCreatedResponse({ type: CreateOneSignalTokenResponse })
  createToken (): CreateOneSignalTokenResponse {
    return this.createTokenUseCase.execute()
  }
}
