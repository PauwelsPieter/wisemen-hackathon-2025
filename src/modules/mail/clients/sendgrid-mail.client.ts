import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import { ConfigService } from '@nestjs/config'
import { MailClient, SendMailOptions } from './mail.client.js'

@Injectable()
export class SendGridMailClient implements MailClient {
  private readonly from: string
  private readonly api: AxiosInstance

  constructor (
    private readonly configService: ConfigService
  ) {
    this.from = this.configService.get<string>('MAIL_FROM_NAME') ?? ''

    this.api = axios.create({
      headers: {
        Authorization: 'Bearer ' + this.configService.get<string>('SENDGRID_API_TOKEN')
      }
    })
  }

  async sendMail (params: SendMailOptions): Promise<void> {
    const payload = {
      personalizations: [
        {
          to: [params.to].flat().map(email => ({ email })),
          subject: params.subject
        }
      ],
      from: {
        email: this.from
      },
      content: [
        {
          type: 'text/html',
          value: params.html
        }
      ]
    }

    await this.api.post('https://api.sendgrid.com/v3/mail/send', payload)
  }
}
