import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MailService } from '../services/mail.service.js'
import { mailClientFactory } from '../clients/mail-client.factory.js'
import { HandlebarsRenderer } from '../renderer/handlebars.renderer.js'

@Module({
  providers: [
    {
      provide: 'MailClient',
      useFactory: mailClientFactory,
      inject: [ConfigService]
    },
    HandlebarsRenderer,
    MailService
  ],
  exports: [MailService]
})
export class MailModule {}
