import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { S3Service } from '../../services/s3.service.js'
import { File } from '../../entities/file.entity.js'
import { CreateFileController } from './create-file.controller.js'
import { CreateFileUseCase } from './create-file.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([File])
  ],
  controllers: [
    CreateFileController
  ],
  providers: [
    CreateFileUseCase,
    S3Service
  ]
})
export class CreateFileModule {}
