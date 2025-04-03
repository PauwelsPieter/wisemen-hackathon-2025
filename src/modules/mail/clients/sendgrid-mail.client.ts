import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import { ConfigService } from '@nestjs/config'
import { captureException } from '@sentry/nestjs'
import { MailUnavailableError } from '../errors/mail-client-unavailable.error.js'
import { MailClient, SendMailOptions } from './mail.client.js'

@Injectable()
export class SendGridMailClient implements MailClient {
  private readonly from: string
  private readonly api?: AxiosInstance

  constructor (
    private readonly configService: ConfigService
  ) {
    try {
      this.api = axios.create({
        headers: {
          Authorization: 'Bearer ' + this.configService.getOrThrow<string>('SENDGRID_API_TOKEN')
        }
      })

      this.from = this.configService.getOrThrow<string>('MAIL_FROM_NAME')
    } catch (error) {
      captureException(error)
    }
  }

  async sendMail (options: SendMailOptions): Promise<void> {
    if (this.api === undefined) {
      throw new MailUnavailableError('The SendGrid Mail client is not configured')
    } else {
      const payload = this.buildPayload(options)

      await this.api.post('https://api.sendgrid.com/v3/mail/send', payload)
    }
  }

  private buildPayload (options: SendMailOptions): object {
    return {
      personalizations: [
        {
          to: [options.to].flat().map(email => ({ email })),
          subject: options.subject
        }
      ],
      from: {
        email: this.from
      },
      content: [
        {
          type: 'text/html',
          value: options.html
        }
      ]
    }
  }
}
