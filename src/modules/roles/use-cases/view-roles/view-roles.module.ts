import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Role } from '../../entities/role.entity.js'
import { ViewRolesUseCase } from './view-roles.use-case.js'
import { ViewRolesController } from './view-roles.controller.js'

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [ViewRolesController],
  providers: [ViewRolesUseCase]
})
export class ViewRolesModule {}
