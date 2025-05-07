import { Module } from '@nestjs/common'
import { TypesenseClient } from './typesense.client.js'

@Module({
  providers: [TypesenseClient],
  exports: [TypesenseClient]
})
export class TypesenseClientModule {}
