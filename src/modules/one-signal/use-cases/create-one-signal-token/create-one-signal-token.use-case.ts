import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import dayjs from 'dayjs'
import { AuthStorage } from '../../../auth/auth.storage.js'
import { CreateOneSignalTokenResponse } from './create-one-signal-token.response.js'

@Injectable()
export class CreateOneSignalTokenUseCase {
  constructor (
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authStorage: AuthStorage
  ) {}

  execute (): CreateOneSignalTokenResponse {
    const userUuid = this.authStorage.getUserUuid()

    const token = this.jwtService.sign({
      iss: this.configService.getOrThrow<string>('ONE_SIGNAL_APP_ID'),
      exp: dayjs().add(1, 'hour').unix(),
      identity: {
        external_id: userUuid
      }
    })

    return new CreateOneSignalTokenResponse(token)
  }
}
