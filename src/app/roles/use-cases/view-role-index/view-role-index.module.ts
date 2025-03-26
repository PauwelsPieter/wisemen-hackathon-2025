import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Role } from '../../entities/role.entity.js'
import { ViewRoleIndexUseCase } from './view-role-index.use-case.js'
import { ViewRoleIndexController } from './view-role-index.controller.js'

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [ViewRoleIndexController],
  providers: [ViewRoleIndexUseCase]
})
export class ViewRoleIndexModule {}
