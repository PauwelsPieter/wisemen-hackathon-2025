import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Role } from '../../entities/role.entity.js'
import { CreateRoleUseCase } from './create-role.use-case.js'
import { CreateRoleController } from './create-role.controller.js'

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [CreateRoleController],
  providers: [CreateRoleUseCase]
})
export class CreateRoleModule {}
