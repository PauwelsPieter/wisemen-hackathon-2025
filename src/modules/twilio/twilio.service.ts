import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { captureException } from '@sentry/nestjs'
import twilio, { Twilio } from 'twilio'
import { CallListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/call.js'
import { MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message.js'
import { TwilioUnavailableError } from './twilio-unailable.error.js'

@Injectable()
export class TwilioService {
  private _client?: Twilio
  private from: string

  constructor (
    private readonly configService: ConfigService
  ) { }

  private get client (): Twilio {
    if (this._client == null) {
      throw new TwilioUnavailableError('The Twilio client is not configured')
    } else {
      return this._client
    }
  }

  public onModuleInit (): void {
    try {
      this._client = twilio(
        this.configService.getOrThrow<string>('TWILIO_ACCOUNT_SID'),
        this.configService.getOrThrow<string>('TWILIO_AUTH_TOKEN')
      )
      this.from = this.configService.getOrThrow<string>('TWILIO_PHONE_NUMBER')
    } catch (error) {
      captureException(error)
    }
  }

  public async createMessage (
    to: string,
    body: string
  ): Promise<string> {
    const params: MessageListInstanceCreateOptions = {
      from: this.from,
      to,
      body
    }

    const message = await this.client.messages.create(params, (error: Error | null) => {
      if (error !== null) captureException(error)

      return 0
    })

    return message.sid
  }

  public async createCall (
    to: string,
    body: string
  ): Promise<string> {
    const params: CallListInstanceCreateOptions = {
      from: this.from,
      to,
      twiml: `<Response><Say>${body}</Say></Response>`
    }

    const call = await this.client.calls.create(params, (error: Error | null) => {
      if (error !== null) captureException(error)

      return 0
    })

    return call.sid
  }
}
