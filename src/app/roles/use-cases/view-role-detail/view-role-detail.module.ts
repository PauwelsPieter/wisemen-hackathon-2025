import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Role } from '../../entities/role.entity.js'
import { ViewRoleDetailUseCase } from './view-role-detail.use-case.js'
import { ViewRoleDetailController } from './view-role-detail.controller.js'

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [ViewRoleDetailController],
  providers: [ViewRoleDetailUseCase]
})
export class ViewRoleDetailModule {}
