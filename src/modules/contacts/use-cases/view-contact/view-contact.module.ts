import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { ViewContactController } from './view-contact.controller.js'
import { ViewContactUseCase } from './view-contact.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact])
  ],
  controllers: [
    ViewContactController
  ],
  providers: [
    ViewContactUseCase
  ]
})
export class ViewContactModule {}
