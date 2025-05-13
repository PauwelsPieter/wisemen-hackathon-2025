import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { User } from '../../entities/user.entity.js'
import { ViewUserDetailController } from './view-user-detail.controller.js'
import { ViewUserDetailUseCase } from './view-user-detail.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User
    ])
  ],
  controllers: [ViewUserDetailController],
  providers: [ViewUserDetailUseCase]
})
export class ViewUserDetailModule {}
