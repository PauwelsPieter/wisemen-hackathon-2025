import { Module } from '@nestjs/common'
import { GetApiInfoController } from './get-api-info.controller.js'

@Module({
  controllers: [
    GetApiInfoController
  ]
})
export class GetApiInfoModule {}
