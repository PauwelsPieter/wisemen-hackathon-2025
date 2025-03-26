import { Module } from '@nestjs/common'
import { CreateFileModule } from '../use-cases/create-file/create-file.module.js'
import { ConfirmFileUploadModule } from '../use-cases/confirm-file-upload/confirm-file-upload.module.js'
import { DeleteFileModule } from '../use-cases/delete-file/delete-file.module.js'
import { DownloadFileModule } from '../use-cases/download-file/download-file.module.js'

@Module({
  imports: [
    CreateFileModule,
    ConfirmFileUploadModule,
    DeleteFileModule,
    DownloadFileModule
  ]
})
export class FileModule {}
