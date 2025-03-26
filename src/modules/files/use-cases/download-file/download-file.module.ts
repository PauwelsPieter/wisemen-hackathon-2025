import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { S3Service } from '../../services/s3.service.js'
import { File } from '../../entities/file.entity.js'
import { DownloadFileController } from './download-file.controller.js'
import { DownloadFileUseCase } from './download-file.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([File])
  ],
  controllers: [
    DownloadFileController
  ],
  providers: [
    DownloadFileUseCase,
    S3Service
  ]
})
export class DownloadFileModule {}
