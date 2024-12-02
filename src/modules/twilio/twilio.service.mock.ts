/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-console */
import { Injectable } from '@nestjs/common'
import { v4 } from 'uuid'

@Injectable()
export class TwilioMockService {
  public async createMessage (
    to: string,
    body: string
  ): Promise<string> {
    console.log('message sent', to, body)

    return v4()
  }

  public async createCall (
    to: string,
    body: string
  ): Promise<string> {
    console.log('call sent', to, body)

    return v4()
  }
}
