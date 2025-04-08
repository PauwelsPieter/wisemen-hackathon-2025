import { Module } from '@nestjs/common'
import { GetApiInfoModule } from './use-cases/get-api-info/get-api-info.module.js'

@Module({
  imports: [
    GetApiInfoModule
  ]
})
export class StatusModule {}
