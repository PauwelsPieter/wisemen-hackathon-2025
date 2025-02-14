import { Inject, Injectable } from '@nestjs/common'
import { MailClient } from '../clients/mail.client.js'
import { HandlebarsRenderer } from '../renderer/handlebars.renderer.js'

export interface MailRecipients {
  to: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
}

@Injectable()
export class MailService {
  constructor (
    @Inject('MailClient') private readonly mailClient: MailClient,
    private readonly handlebarsRenderer: HandlebarsRenderer
  ) {}

  async sendRawMail (
    recipients: MailRecipients,
    subject: string,
    html: string
  ) {
    await this.mailClient.sendMail({
      ...recipients,
      subject,
      html
    })
  }

  async sendTemplateMail (
    recipients: MailRecipients,
    subject: string,
    hbsFilePath: string,
    data: Record<string, unknown>
  ) {
    const html = await this.handlebarsRenderer.render(hbsFilePath, data)

    await this.sendRawMail(recipients, subject, html)
  }
}
