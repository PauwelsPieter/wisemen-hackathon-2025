import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { UserModule } from '../../../app/users/user.module.js'
import { S3Service } from '../services/s3.service.js'
import { FileRepository } from '../repositories/file.repository.js'
import { FileController } from '../controllers/file.controller.js'
import { FileService } from '../services/file.service.js'
import { File } from '../entities/file.entity.js'
import { FileLink } from '../entities/file-link.entity.js'
import { FileLinkRepository } from '../repositories/file-link.repository.js'
import { FileLinkService } from '../services/file-link.service.js'
import { FileFlowService } from '../services/file.flows.service.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([File, FileLink]),
    UserModule
  ],
  controllers: [FileController],
  providers: [
    FileRepository,
    FileLinkRepository,
    FileFlowService,
    FileService,
    FileLinkService,
    S3Service

    // RemoveUnusedMediaJobHandler,
    // RemoveUnusedMediaCron
  ],
  exports: [
    FileFlowService
  ]
})
export class FileModule {}
