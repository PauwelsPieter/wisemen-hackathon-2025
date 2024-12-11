import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Role } from '../../entities/role.entity.js'
import { UpdateRoleController } from './update-role.controller.js'
import { UpdateRoleUseCase } from './update-role.use-case.js'

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [UpdateRoleController],
  providers: [UpdateRoleUseCase]
})
export class UpdateRoleModule {}
