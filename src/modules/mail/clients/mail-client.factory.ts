import { ConfigService } from '@nestjs/config'
import { MailClient } from '../clients/mail.client.js'
import { ScalewayMailClient } from '../clients/scaleway-mail.client.js'
import { SendGridMailClient } from '../clients/sendgrid-mail.client.js'
import { MockMailService } from '../clients/mock-mail.client.js'

export function mailClientFactory (configService: ConfigService): MailClient {
  const env = configService.get<string>('NODE_ENV', 'local')

  switch (env) {
    case 'local':
      return new SendGridMailClient(configService)
    case 'test':
      return new MockMailService()
    default:
      return new ScalewayMailClient(configService)
  }
}
