import { ApiProperty } from '@nestjs/swagger'

export class CreateOneSignalTokenResponse {
  @ApiProperty({ type: String })
  token: string

  constructor (token: string) {
    this.token = token
  }
}
