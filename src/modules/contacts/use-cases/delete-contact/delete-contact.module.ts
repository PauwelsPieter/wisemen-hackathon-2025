import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { DeleteContactUseCase } from './delete-contact.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact])
  ],
  controllers: [
  ],
  providers: [
    DeleteContactUseCase
  ]
})
export class DeleteContactModule {}
