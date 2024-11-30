import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { ViewContactDetailUseCase } from './view-contact-detail.use-case.js'
import { ViewContactDetailController } from './view-contact-detail.controller.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact])
  ],
  controllers: [
    ViewContactDetailController
  ],
  providers: [
    ViewContactDetailUseCase
  ]
})
export class ViewContactDetailModule { }
