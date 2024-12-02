import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { captureException } from '@sentry/nestjs'
import twilio, { Twilio } from 'twilio'

@Injectable()
export class TwilioService {
  private client: Twilio

  constructor (
    private readonly configService: ConfigService
  ) { }

  public onModuleInit (): void {
    this.client = twilio(
      this.configService.getOrThrow<string>('TWILIO_ACCOUNT_SID'),
      this.configService.getOrThrow<string>('TWILIO_AUTH_TOKEN')
    )
  }

  public async createMessage (
    to: string,
    body: string
  ): Promise<string> {
    const from = this.configService.getOrThrow<string>('TWILIO_PHONE_NUMBER')

    const message = await this.client.messages.create({ from, to, body }, (error: Error | null) => {
      if (error !== null) captureException(error)

      return 0
    })

    return message.sid
  }

  public async createCall (
    to: string,
    body: string
  ): Promise<string> {
    const from = this.configService.getOrThrow<string>('TWILIO_PHONE_NUMBER')
    const call = await this.client.calls.create({
      from,
      to,
      twiml: `<Response><Say>${body}</Say></Response>`
    }, (error: Error | null) => {
      if (error !== null) captureException(error)

      return 0
    })

    return call.sid
  }
}
