import { Injectable } from '@nestjs/common'
import axios, { type AxiosInstance } from 'axios'
import { ConfigService } from '@nestjs/config'
import { captureError } from 'rxjs/internal/util/errorContext'
import { MailUnavailableError } from '../errors/mail-client-unavailable.error.js'
import type { SendMailOptions, MailClient } from './mail.client.js'

@Injectable()
export class ScalewayMailClient implements MailClient {
  private readonly region: string
  private readonly projectId: string
  private readonly from: string
  private readonly api?: AxiosInstance

  constructor (
    private readonly configService: ConfigService
  ) {
    this.region = this.configService.get<string>('SCW_MAIL_REGION', 'fr-par')

    try {
      this.projectId = this.configService.getOrThrow<string>('SCW_PROJECT_ID')
      this.from = this.configService.getOrThrow<string>('MAIL_FROM_NAME')

      this.api = axios.create({
        headers: {
          'X-Auth-Token': this.configService.getOrThrow<string>('SCW_API_KEY')
        }
      })
    } catch (error) {
      captureError(error)
    }
  }

  public async sendMail (options: SendMailOptions): Promise<void> {
    if (this.configService.get('NODE_ENV', 'local') === 'test') {
      return
    }

    if (this.api === undefined) {
      throw new MailUnavailableError('The Scaleway Mail client is not configured')
    }

    const payload = this.buildPayload(options)

    await this.api.post(`https://api.scaleway.com/transactional-email/v1alpha1/regions/${this.region}/emails`, payload)
  }

  private buildPayload (options: SendMailOptions): object {
    const from = { email: options.from ?? this.from }
    const to = options.to instanceof Array
      ? options.to.map(email => ({ email }))
      : [{ email: options.to }]
    const cc = options.cc instanceof Array
      ? options.cc.map(email => ({ email }))
      : (options.cc != null ? [{ email: options.cc }] : options.cc)
    const bcc = options.bcc instanceof Array
      ? options.bcc.map(email => ({ email }))
      : (options.bcc != null ? [{ email: options.bcc }] : options.bcc)

    return {
      from,
      to,
      cc,
      bcc,
      subject: options.subject,
      text: options.text,
      html: options.html,
      project_id: this.projectId
    }
  }
}
