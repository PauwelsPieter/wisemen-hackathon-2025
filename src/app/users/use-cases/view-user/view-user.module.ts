import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { User } from '../../entities/user.entity.js'
import { ViewUserController } from './view-user.controller.js'
import { ViewUserUseCase } from './view-user.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User
    ])
  ],
  controllers: [ViewUserController],
  providers: [ViewUserUseCase]
})
export class ViewUserModule {}
