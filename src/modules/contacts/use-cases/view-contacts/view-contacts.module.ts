import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { ViewContactsController } from './view-contacts.controller.js'
import { ViewContactsUseCase } from './view-contacts.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact])
  ],
  controllers: [
    ViewContactsController
  ],
  providers: [
    ViewContactsUseCase
  ]
})
export class ViewContactsModule {}
