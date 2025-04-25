import { Module } from '@nestjs/common'
import { S3Module } from '../../../s3/s3.module.js'
import { FilePresigner } from './file-presigner.js'

@Module({
  imports: [S3Module],
  providers: [FilePresigner],
  exports: [FilePresigner]
})
export class FilePresignerModule {}
