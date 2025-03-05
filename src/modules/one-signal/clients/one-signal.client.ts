import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as OneSignal from '@onesignal/node-onesignal'

@Injectable()
export class OneSignalClient {
  private readonly client: OneSignal.DefaultApi

  constructor (
    private readonly configService: ConfigService
  ) {
    const configuration = OneSignal.createConfiguration({
      restApiKey: this.configService.getOrThrow<string>('ONESIGNAL_API_KEY')
    })

    this.client = new OneSignal.DefaultApi(configuration)
  }

  public async sendPushNotification (
    name: string,
    headings: OneSignal.LanguageStringMap,
    contents: OneSignal.LanguageStringMap,
    userUuids: string[]
  ): Promise<void> {
    const notification = new OneSignal.Notification()

    notification.app_id = this.configService.getOrThrow<string>('ONESIGNAL_APP_ID')
    notification.name = name
    notification.headings = headings
    notification.contents = contents
    notification.include_aliases = {
      external_id: userUuids
    }

    await this.client.createNotification(notification)
  }
}
