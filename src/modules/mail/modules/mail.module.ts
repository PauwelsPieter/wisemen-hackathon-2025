import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MjmlRenderer } from '../renderer/mjml.renderer.js'
import { MailService } from '../services/mail.service.js'
import { mailClientFactory } from '../clients/mail-client.factory.js'

@Module({
  providers: [
    {
      provide: 'MailClient',
      useFactory: mailClientFactory,
      inject: [ConfigService]
    },
    MjmlRenderer,
    MailService
  ],
  exports: [MailService]
})
export class MailModule {}
