import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { CreateContactController } from './create-contact.controller.js'
import { CreateContactUseCase } from './create-contact.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact])
  ],
  controllers: [
    CreateContactController
  ],
  providers: [
    CreateContactUseCase
  ]
})
export class CreateContactModule {}
