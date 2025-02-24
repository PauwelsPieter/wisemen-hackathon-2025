import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Role } from '../../entities/role.entity.js'
import { ViewRoleUseCase } from './view-role.use-case.js'
import { ViewRoleController } from './view-role.controller.js'

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [ViewRoleController],
  providers: [ViewRoleUseCase]
})
export class ViewRoleModule {}
