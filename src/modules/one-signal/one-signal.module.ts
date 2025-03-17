import { Module } from '@nestjs/common'
import { OneSignalClient } from './clients/one-signal.client.js'
import { CreateOneSignalTokenModule } from './use-cases/create-one-signal-token/create-one-signal-token.module.js'

@Module({
  imports: [CreateOneSignalTokenModule],
  providers: [OneSignalClient],
  exports: [OneSignalClient]
})
export class OneSignalModule {}
