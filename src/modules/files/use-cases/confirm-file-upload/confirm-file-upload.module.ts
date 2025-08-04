import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { File } from '../../entities/file.entity.js'
import { ConfirmFileUploadController } from './confirm-file-upload.controller.js'
import { ConfirmFileUploadUseCase } from './confirm-file-upload.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([File])
  ],
  controllers: [
    ConfirmFileUploadController
  ],
  providers: [
    ConfirmFileUploadUseCase
  ]
})
export class ConfirmFileUploadModule {}
