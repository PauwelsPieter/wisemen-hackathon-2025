/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-console */
import { randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TwilioMockService {
  public async createMessage (
    to: string,
    body: string
  ): Promise<string> {
    console.log('message sent', to, body)

    return randomUUID()
  }

  public async createCall (
    to: string,
    body: string
  ): Promise<string> {
    console.log('call sent', to, body)

    return randomUUID()
  }
}
