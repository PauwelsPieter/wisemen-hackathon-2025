import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { User } from '../../entities/user.entity.js'
import { ViewMeUseCase } from './view-me.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User
    ])
  ],
  controllers: [ViewMeModule],
  providers: [ViewMeUseCase]
})
export class ViewMeModule {}
