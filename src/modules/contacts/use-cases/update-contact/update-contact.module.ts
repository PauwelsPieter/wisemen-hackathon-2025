import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { UpdateContactController } from './update-contact.controller.js'
import { UpdateContactUseCase } from './update-contact.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact])
  ],
  controllers: [
    UpdateContactController
  ],
  providers: [
    UpdateContactUseCase
  ]
})
export class UpdateContactModule {}
