import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Role } from '../../entities/role.entity.js'
import { UserRole } from '../../entities/user-role.entity.js'
import { RoleCacheModule } from '../../cache/role-cache.module.js'
import { DeleteRoleController } from './delete-role.controller.js'
import { DeleteRoleUseCase } from './delete-role.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, UserRole]),
    RoleCacheModule
  ],
  controllers: [DeleteRoleController],
  providers: [DeleteRoleUseCase]
})
export class DeleteRoleModule {}
