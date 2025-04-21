import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { File } from '../../entities/file.entity.js'
import { DomainEventEmitterModule } from '../../../domain-events/domain-event-emitter.module.js'
import { ConfirmFileUploadController } from './confirm-file-upload.controller.js'
import { ConfirmFileUploadUseCase } from './confirm-file-upload.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    DomainEventEmitterModule
  ],
  controllers: [
    ConfirmFileUploadController
  ],
  providers: [
    ConfirmFileUploadUseCase
  ]
})
export class ConfirmFileUploadModule {}
