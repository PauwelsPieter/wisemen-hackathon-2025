import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { FilePresignerModule } from '../../../../modules/files/services/presign-file/file-presigner.module.js'
import { ViewContactDetailUseCase } from './view-contact-detail.use-case.js'
import { ViewContactDetailController } from './view-contact-detail.controller.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact]),
    FilePresignerModule
  ],
  controllers: [
    ViewContactDetailController
  ],
  providers: [
    ViewContactDetailUseCase
  ]
})
export class ViewContactDetailModule { }
