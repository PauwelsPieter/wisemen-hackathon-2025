import { Module } from '@nestjs/common'
import { ZitadelClient } from './zitadel.client.js'

@Module({
  providers: [ZitadelClient],
  exports: [ZitadelClient]
})
export class ZitadelModule { }
