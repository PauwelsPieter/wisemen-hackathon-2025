import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { File } from '../../entities/file.entity.js'
import { DomainEventEmitterModule } from '../../../domain-events/domain-event-emitter.module.js'
import { S3Module } from '../../../s3/s3.module.js'
import { CreateFileController } from './create-file.controller.js'
import { CreateFileUseCase } from './create-file.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    DomainEventEmitterModule,
    S3Module
  ],
  controllers: [CreateFileController],
  providers: [CreateFileUseCase]
})
export class CreateFileModule {}
