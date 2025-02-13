import { Injectable } from '@nestjs/common'
import { MailClient, SendMailOptions } from './mail.client.js'

@Injectable()
export class MockMailService implements MailClient {
  async sendMail (params: SendMailOptions): Promise<void> {
    await Promise.resolve(params)
  }
}
