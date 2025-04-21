import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { File } from '../../entities/file.entity.js'
import { S3Module } from '../../../s3/s3.module.js'
import { DownloadFileController } from './download-file.controller.js'
import { DownloadFileUseCase } from './download-file.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    S3Module
  ],
  controllers: [DownloadFileController],
  providers: [DownloadFileUseCase]
})
export class DownloadFileModule {}
