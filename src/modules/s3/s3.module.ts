import { Module } from '@nestjs/common'
import { S3 } from './s3.js'

@Module({
  providers: [S3],
  exports: [S3]
})
export class S3Module {}
