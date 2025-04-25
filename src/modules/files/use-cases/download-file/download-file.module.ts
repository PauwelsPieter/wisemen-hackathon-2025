import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { File } from '../../entities/file.entity.js'
import { FilePresignerModule } from '../../services/presign-file/file-presigner.module.js'
import { DownloadFileController } from './download-file.controller.js'
import { DownloadFileUseCase } from './download-file.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    FilePresignerModule
  ],
  controllers: [DownloadFileController],
  providers: [DownloadFileUseCase]
})
export class DownloadFileModule {}
