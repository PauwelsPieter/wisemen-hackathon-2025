import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { File } from '../../entities/file.entity.js'
import { DeleteFileController } from './delete-file.controller.js'
import { DeleteFileUseCase } from './delete-file.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([File])
  ],
  controllers: [
    DeleteFileController
  ],
  providers: [
    DeleteFileUseCase
  ]
})
export class DeleteFileModule {}
